# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20           # Esto instala Node.js y npx
    pkgs.nodePackages.npm    # Asegura que tengas el gestor de paquetes
    pkgs.typescript          # Para que no tengas errores en tus archivos .ts
  ];

  # Sets environment variables in the workspace
  env = {};

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "dsznajder.es7-react-js-snippets" # Atajos para React
      "bradlc.vscode-tailwindcss"      # Para que te ayude con Tailwind
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        web = {
          # Comando para iniciar tu servidor de Vite
          command = ["npm", "run", "dev", "--", "--port", "$PORT", "--host", "0.0.0.0"];
          manager = "web";
        };
      };
    };

    # Workspace lifecycle hooks
    onCreate = {
      # Instala las librerías automáticamente cuando creas el proyecto
      npm-install = "npm install";
    };
  };
}