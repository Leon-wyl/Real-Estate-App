import { createContext, useEffect, useState } from "react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext<{ loaded: boolean }>({ loaded: false });

interface UploadWidgetProps {
  uwConfig: any;
  setPublicId?: (id: string) => void;
  setState: React.Dispatch<React.SetStateAction<string[]>>;
}

function UploadWidget({ uwConfig, setState }: UploadWidgetProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded && window.cloudinary) {
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            setState((prev: string[]) => [...prev, result.info.secure_url]);
          }
        }
      );

      const widgetButton = document.getElementById("upload_widget");
      if (widgetButton) {
        widgetButton.addEventListener(
          "click",
          function () {
            myWidget.open();
          },
          { once: true }
        );
      }
      myWidget.open(); // Open immediately on click
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="cloudinary-button"
        onClick={initializeCloudinaryWidget}
      >
        Upload
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };
