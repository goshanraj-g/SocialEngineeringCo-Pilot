document.getElementById("uploadButton").addEventListener("click", function () {
    const fileInput = document.getElementById("fileInput");
    const textInput = document.getElementById("textInput").value.trim();
    const output = document.getElementById("output");

    // Validate that either a file is uploaded or transcript text is provided
    if (!fileInput.files.length && !textInput) {
        output.style.color = "red";
        output.innerText = "Please upload a file or enter a transcript.";
        return;
    }

    // If valid input is provided, redirect to main.html
    const fileName = fileInput.files.length ? fileInput.files[0].name : "No file uploaded";
    const encodedText = encodeURIComponent(textInput || "No text entered");
    const redirectUrl = `main.html?fileInput=${encodeURIComponent(fileName)}&textInput=${encodedText}`;

    // Redirect to main.html with the input data as query parameters
    window.location.href = redirectUrl;
});
