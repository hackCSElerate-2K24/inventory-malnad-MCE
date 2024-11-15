// Access the video element
const video = document.getElementById("video");

// Function to start the webcam and the barcode scanner
function startWebcam() {
  // Check if the browser supports mediaDevices and getUserMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Assign the stream to the video element's source
        video.srcObject = stream;
        video.play();

        // Start QuaggaJS barcode scanner after the video stream starts
        startBarcodeScanner();
      })
      .catch((error) => {
        console.error("Error accessing the webcam:", error);
        alert("Could not access the webcam. Please allow camera permissions.");
      });
  } else {
    alert("Your browser does not support accessing the webcam.");
  }
}

// Function to start QuaggaJS for barcode scanning
function startBarcodeScanner() {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: video, // Attach to the video element
        constraints: {
          width: 400,
          height: 300,
          facingMode: "environment", // Use the back camera on mobile
        },
      },
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "ean_8_reader",
          "upc_reader",
          "upc_e_reader",
        ], // Supported barcode types
      },
    },
    function (err) {
      if (err) {
        console.error("QuaggaJS initialization failed:", err);
        alert("Failed to initialize barcode scanner.");
        return;
      }
      console.log("QuaggaJS initialized successfully.");
      Quagga.start(); // Start the barcode scanner
    }
  );

  // Event listener for barcode detection
  Quagga.onDetected((result) => {
    const code = result.codeResult.code;
    console.log("Barcode detected:", code);

    // Stop the scanner after detecting a barcode
    Quagga.stop();

    // Fill the form with detected barcode data (assuming barcode is an item name)
    document.getElementById("barcode-name").value = code;
    document.getElementById("barcode-quantity").value = 1; // Set default quantity
    document.getElementById("barcode-price").value = 0.0; // Set default price

    // Show the form to confirm the scanned item details
    document.getElementById("barcode-form").style.display = "block";
  });
}

// Start the webcam and barcode scanner when the "Start Scanning" button is clicked
document.getElementById("start-scan").addEventListener("click", startWebcam);
