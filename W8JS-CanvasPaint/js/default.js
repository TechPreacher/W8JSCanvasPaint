// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());

            drawingApp.init();

            // Register event handlers for AppBar
            document.getElementById('appBar').winControl.sticky = true;
            document.getElementById('redButton').addEventListener("click", drawingApp.setColorRed, false);
            document.getElementById('greenButton').addEventListener("click", drawingApp.setColorGreen, false);
            document.getElementById('blueButton').addEventListener("click", drawingApp.setColorBlue, false);

            // Import File
            document.getElementById("importButton").addEventListener("click", function () {
                var img = new Image();
                img.onload = function () {
                    setTimeout(function () {
                        var scaleFactor = Math.max(window.innerHeight / img.naturalHeight, window.innerWidth / img.naturalWidth);
                        document.getElementById("canvas").getContext("2d").drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.naturalWidth * scaleFactor, img.naturalHeight * scaleFactor);
                    }, 100);
                };

                var picker = new Windows.Storage.Pickers.FileOpenPicker();
                picker.fileTypeFilter.replaceAll([".jpg", ".bmp", ".gif", ".png"]);
                picker.pickSingleFileAsync().then(function (file) {
                    var blobUrl = URL.createObjectURL(file);
                    img.src = blobUrl;
                });
            });

            // Save File
            document.getElementById("exportButton").addEventListener("click", function () {
                var blob = document.getElementById("canvas").msToBlob();
                // Next line needs "Pictures Libary" access capability.
                var picker = new Windows.Storage.Pickers.FileSavePicker();
                picker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
                picker.fileTypeChoices.insert("PNG", [".png"]);
                picker.pickSaveFileAsync().then(function (file) {
                    file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (stream) {
                        var input = blob.msDetachStream();
                        var output = stream.getOutputStreamAt(0);
                        Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output).then(function () {
                            output.flushAsync().then(function () {
                                input.close();
                                output.close();
                                Windows.UI.Popups.MessageDialog("File saved.").showAsync().then(function () { });
                            });
                        });
                    });
                });
            });

            // Share Contract
            Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView().addEventListener("datarequested", function (e) {
                var request = e.request;
                var blob = document.getElementById("canvas").msToBlob();

                request.data.properties.title = "CanvasPaint doodle";
                request.data.properties.description = "Share image from CanvasPaint";
                request.data.properties.applicationName = "CanvasPaint";

                var streamReference = Windows.Storage.Streams.RandomAccessStreamReference.createFromStream(blob.msDetachStream());
                request.data.properties.thumbnail = streamReference;
                request.data.setBitmap(streamReference);

            });

            // Load last color used.
            if (Windows.Storage.ApplicationData.current.localSettings.values["latestColor"] != null) {
                curColor = Windows.Storage.ApplicationData.current.localSettings.values["latestColor"];
            }
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
        Windows.Storage.ApplicationData.current.localSettings.values["latestColor"] = curColor;
    };

    app.start();
})();
