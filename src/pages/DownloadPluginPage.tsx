import { Download } from 'lucide-react';

export default function DownloadPluginPage() {
  const handleDownload = async () => {
    try {
      const response = await fetch('/toliwork-importer.zip');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'toliwork-importer.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du fichier');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Download className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Plugin WordPress Toliwork
            </h1>
            <p className="text-slate-600">
              Téléchargez le plugin pour importer votre catalogue dans WordPress
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-lg text-slate-800 mb-3">
              Ce qui sera importé :
            </h2>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>5 catégories de sites web</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>12 modèles de sites avec toutes leurs informations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Custom Post Type "Modèles de Sites"</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Taxonomie "Catégories de Sites"</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5" />
            Télécharger le plugin (toliwork-importer.zip)
          </button>

          <div className="mt-8 border-t pt-6">
            <h3 className="font-semibold text-slate-800 mb-3">
              Instructions d'installation :
            </h3>
            <ol className="space-y-3 text-slate-700 text-sm">
              <li className="flex">
                <span className="font-semibold mr-2 text-blue-600">1.</span>
                <span>Téléchargez le fichier ZIP en cliquant sur le bouton ci-dessus</span>
              </li>
              <li className="flex">
                <span className="font-semibold mr-2 text-blue-600">2.</span>
                <span>Dans votre admin WordPress, allez dans <strong>Extensions → Ajouter</strong></span>
              </li>
              <li className="flex">
                <span className="font-semibold mr-2 text-blue-600">3.</span>
                <span>Cliquez sur <strong>"Téléverser une extension"</strong></span>
              </li>
              <li className="flex">
                <span className="font-semibold mr-2 text-blue-600">4.</span>
                <span>Sélectionnez le fichier ZIP téléchargé</span>
              </li>
              <li className="flex">
                <span className="font-semibold mr-2 text-blue-600">5.</span>
                <span>Activez le plugin</span>
              </li>
              <li className="flex">
                <span className="font-semibold mr-2 text-blue-600">6.</span>
                <span>Allez dans <strong>Outils → Toliwork Importer</strong></span>
              </li>
              <li className="flex">
                <span className="font-semibold mr-2 text-blue-600">7.</span>
                <span>Cliquez sur <strong>"Lancer l'importation"</strong></span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
