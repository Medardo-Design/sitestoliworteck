<?php
/**
 * Plugin Name: Toliwork Importer
 * Description: Import products from Toliwork JSON export to WooCommerce
 * Version: 1.0.0
 * Author: Toliwork Tech
 */

if (!defined('ABSPATH')) exit;

class ToliworkImporter {

    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_post_toliwork_import', array($this, 'handle_import'));
    }

    public function add_admin_menu() {
        add_management_page(
            'Toliwork Importer',
            'Toliwork Importer',
            'manage_options',
            'toliwork-importer',
            array($this, 'admin_page')
        );
    }

    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>Toliwork Product Importer</h1>

            <?php if (isset($_GET['imported'])): ?>
                <div class="notice notice-success">
                    <p><strong>Success!</strong> <?php echo intval($_GET['imported']); ?> products imported.</p>
                </div>
            <?php endif; ?>

            <form method="post" action="<?php echo admin_url('admin-post.php'); ?>" enctype="multipart/form-data">
                <input type="hidden" name="action" value="toliwork_import">
                <?php wp_nonce_field('toliwork_import_action', 'toliwork_import_nonce'); ?>

                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="json_file">JSON Export File</label></th>
                        <td>
                            <input type="file" name="json_file" id="json_file" accept=".json" required>
                            <p class="description">Upload the JSON export file from Toliwork</p>
                        </td>
                    </tr>
                </table>

                <?php submit_button('Import Products'); ?>
            </form>
        </div>
        <?php
    }

    public function handle_import() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        check_admin_referer('toliwork_import_action', 'toliwork_import_nonce');

        if (!isset($_FILES['json_file'])) {
            wp_die('No file uploaded');
        }

        $file = $_FILES['json_file'];

        if ($file['error'] !== UPLOAD_ERR_OK) {
            wp_die('Upload error');
        }

        $json = file_get_contents($file['tmp_name']);
        $data = json_decode($json, true);

        if (!$data || !isset($data['products'])) {
            wp_die('Invalid JSON format');
        }

        $imported = 0;

        foreach ($data['products'] as $product_data) {
            $product_id = $this->import_product($product_data);
            if ($product_id) {
                $imported++;
            }
        }

        wp_redirect(add_query_arg(
            array('page' => 'toliwork-importer', 'imported' => $imported),
            admin_url('tools.php')
        ));
        exit;
    }

    private function import_product($data) {
        $product = new WC_Product_Simple();

        $product->set_name($data['name'] ?? 'Untitled');
        $product->set_description($data['description'] ?? '');
        $product->set_short_description($data['short_description'] ?? '');
        $product->set_sku($data['sku'] ?? '');
        $product->set_regular_price($data['price'] ?? 0);
        $product->set_manage_stock($data['manage_stock'] ?? false);

        if (isset($data['stock_quantity'])) {
            $product->set_stock_quantity($data['stock_quantity']);
        }

        if (isset($data['categories']) && is_array($data['categories'])) {
            $category_ids = array();
            foreach ($data['categories'] as $cat_name) {
                $term = get_term_by('name', $cat_name, 'product_cat');
                if (!$term) {
                    $term = wp_insert_term($cat_name, 'product_cat');
                    if (!is_wp_error($term)) {
                        $category_ids[] = $term['term_id'];
                    }
                } else {
                    $category_ids[] = $term->term_id;
                }
            }
            $product->set_category_ids($category_ids);
        }

        if (isset($data['images']) && is_array($data['images'])) {
            $image_ids = array();
            foreach ($data['images'] as $image_url) {
                $image_id = $this->upload_image($image_url, $data['name'] ?? 'Product');
                if ($image_id) {
                    $image_ids[] = $image_id;
                }
            }

            if (!empty($image_ids)) {
                $product->set_image_id($image_ids[0]);
                if (count($image_ids) > 1) {
                    $product->set_gallery_image_ids(array_slice($image_ids, 1));
                }
            }
        }

        if (isset($data['meta_data']) && is_array($data['meta_data'])) {
            foreach ($data['meta_data'] as $key => $value) {
                $product->update_meta_data($key, $value);
            }
        }

        $product_id = $product->save();

        return $product_id;
    }

    private function upload_image($url, $product_name) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');

        $tmp = download_url($url);

        if (is_wp_error($tmp)) {
            return false;
        }

        $file_array = array(
            'name' => basename($url),
            'tmp_name' => $tmp
        );

        $id = media_handle_sideload($file_array, 0, $product_name);

        if (is_wp_error($id)) {
            @unlink($file_array['tmp_name']);
            return false;
        }

        return $id;
    }
}

new ToliworkImporter();
