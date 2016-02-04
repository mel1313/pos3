// I act a repository for the remote friend collection.

app.service(
            "melvinLib",
            function ($http, $rootScope, $q, $modal) {

                return ({
                    ReadData: ReadData
                });


                         

              
                function ReadData(strFile) {

                    var request = $http({
                        method: "get",
                        url: strFile
                    });

                    return (request.then(handleSuccess, handleError));

                }

              

               
                

                function handleError(response) {

                    // The API response from the server should be returned in a
                    // nomralized format. However, if the request was not handled by the
                    // server (or what not handles properly - ex. server error), then we
                    // may have to normalize it on our end, as best we can.
                    var strErr;
                    strErr = '';

                    if (response.status != undefined) {
                        strErr += 'Status : ' + response.status + "\n";
                    }

                    if (response.statusText != undefined) {
                        strErr += 'StatusText : ' + response.statusText + "\n";
                    }

                    if (response.data != undefined) {
                        strErr += 'ErrMsg : ' + response.data + "\n";


                    }


                    if (response.data.Message != undefined)
                    { strErr += "Message : " + response.data.Message + "\n"; }

                    if (response.data.MessageDetail != null)
                    { strErr += "MessageDetail : " + response.data.MessageDetail + "\n"; }


                    if (response.description != undefined)
                    { strErr += 'Response Description : ' + response.description + "\n"; }

                    if (response.stack != null)
                    { strErr += 'Response Stack : ' + response.stack + "\n"; }



                    //                    if (strErr == "") {
                    //                        if (response.data.ExceptionMessage != null)
                    //                        { strErr += "ExceptionMessage : " + response.data.ExceptionMessage + "\n"; }
                    //                        if (response.data.ExceptionType != null)
                    //                        { strErr += "ExceptionType : " + response.data.ExceptionType + "\n"; }
                    //                    }

                    //                    if (strErr == "") {
                    //                        if (response.status != null)
                    //                        { strErr += 'Status : ' + response.status + "\n"; }
                    //                        if (response.statusText != null)
                    //                        { strErr += 'StatusMessage : ' + response.statusText + "\n"; }
                    //                    }



                    return ($q.reject(strErr));


                    // Otherwise, use expected error message.
                    //    return (response.data);

                }

                function handleSuccess(response) {
                    return (response.data);
                }

               

            }
        );



          