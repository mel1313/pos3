app.controller("mainCtrl", function ($scope, $q, $timeout, $modal, $http, melvinLib, localStorageService) {

    // Setup
    $scope.Payment = false ;
    $scope.TotalOrder = 0;
    $scope.TotalPaid = 0 ;
    $scope.TotalBalance = 0;
    $scope.Title = 'Order';


   
    // Setup Sales Grid
    var SalecolumnDefs = [
      { field:"Article", displayName: 'Sku', width: 200},
      { field: "Description", displayName: "Description", enableCellEdit: false, width: 400},
      { field: "Quantity", displayName: "Quantity", width: 100},
      { field: "Price", displayName: "Price", enableCellEdit: false, width: 100},
      { field: "Discount", displayName: "Discount", width: 100},
      { field: "Amount", displayName: "Amount", enableCellEdit: false, width: 100}
    ]
    

    $scope.SalesGrid = {
        multiSelect: false,
      }

    
    // Setup Payment Grid
    var PaymentcolumnDefs = [
      { field: 'Type', displayName: 'Type', editableCellTemplate: 'ui-grid/dropdownEditor', width: '100', editDropdownIdLabel: 'Value', editDropdownValueLabel: 'Value', editDropdownOptionsArray: [{ Key: 0, Value: 'Cash'},{ Key: 1, Value: 'Visa'},{ Key: 2, Value: 'Master'}],  cellEditableCondition: $scope.AllowEdit },
      { field: "CardNo", displayName: "CardNo",  width: 600},
      { field: "Amount", displayName: "Amount",  width: 100}
    ]

    $scope.PaymentGrid = {
        multiSelect: false,
    }


    // Setup ColumnDefintions        
    $scope.SalesGrid.columnsDefs = SalecolumnDefs ;
    $scope.PaymentGrid.columnDefs = PaymentcolumnDefs;


    // Extract Receipt Number from device storage
    $scope.RcptNo = localStorageService.get("RcptNo");

    if ($scope.RcptNo == undefined) {
        $scope.RcptNo = 1;
        localStorageService.set("RcptNo", $scope.RcptNo);
    }

    ////////////////////
    // Initialize Grids
    ClearOrder();
    ClearPay();

    GetArticleData("ArticleMaster.json");


    // Events

    $scope.onPayment = function () {
        $scope.Payment = true;
        $scope.Title = 'Payment';
    }

    $scope.onOrder = function () {
        $scope.Payment = false;
        $scope.Title = 'Order';
    }

    $scope.onSubmit = function () {


        var SavedTransactions = localStorageService.get("Trx");

        if (SavedTransactions == null) {
            SavedTransactions = [];
        }

        var aryOrder = [];
        var aryPay = [];

        for (var i = 0; i < $scope.SalesGrid.data.length; i++) {
            if ($scope.SalesGrid.data[i].Article == '') {
                break;
            }

            var objOrder = {};
            objOrder.Article = $scope.SalesGrid.data[i].Article;
            objOrder.Qty = $scope.SalesGrid.data[i].Qty;
            objOrder.Price = $scope.SalesGrid.data[i].Price;
            aryOrder[aryOrder.length] = objOrder;


            var objPay = {};
            objPay.Type = $scope.PaymentGrid.data[i].Type;
            objPay.CardNo = $scope.PaymentGrid.data[i].CardNo;
            objPay.Amount = $scope.PaymentGrid.data[i].Amount;
            aryPay[aryPay.length] = objPay;

        }

        SavedTransactions[SavedTransactions.length] = { "RcptNo": $scope.RcptNo, "Order": aryOrder, aryPay: 100 }
        localStorageService.set("Trx", SavedTransactions);

        $scope.RcptNo += 1;
        localStorageService.set("RcptNo", $scope.RcptNo);

        // Zeroise Grids
        ClearOrder();
        ClearPay();

        // Set to Zeroes
        $scope.Payment = false;
        $scope.TotalOrder = 0;
        $scope.TotalPaid = 0;
        $scope.TotalBalance = 0;
        $scope.Title = 'Order';

    }

    $scope.onArticle = function() {

   

      var modalInstance = $modal.open({
        animation: false ,
        templateUrl: 'appPg/Article.html',
        controller: 'articleCtrl',
        size: '',
        resolve: {
          params: function() {
              return $scope.ArticleData;
          }
        }
      });

      modalInstance.result.then(function (articledata) {

          for (var i = 0; i < $scope.SalesGrid.data.length; i++) {
              if ($scope.SalesGrid.data[i].Article == '') {
                  $scope.SalesGrid.data[i].Article = articledata.Sku;
                  $scope.SalesGrid.data[i].Description = articledata.Description;
                  $scope.SalesGrid.data[i].Price = articledata.Price;
                  $scope.SalesGrid.data[i].Qty = 1

                  CalculateOrder();


                  break;

              }
              
          }

          
      }, function() {
      });


    }

    $scope.$on('uiGridEventEndCellEdit', function(data) {

        if ($scope.Payment == false) {
            if (data.targetScope.row.entity.Article != '' & data.targetScope.row.entity.Article != undefined) {
                
                var row = data.targetScope.row.entity;

                if (row.Description == '') {
                    var Article = FindArticle(row.Article);
           
                    if (Article == undefined) {
                            alert('Not Listed');
                    }
                    
                    row.Description = Article.Description ;
                    row.Price = Article.Price ;
                    row.Qty = 1 ;
                }

              
                CalculateOrder();

                }

                
           
                   }
        else {

            CalculatePaid() ;

            }

        
    });


    // Functions

    function CalculateOrder() {

        $scope.TotalOrder = 0;

        for (var i = 0; i < $scope.SalesGrid.data.length; i++) {
            if ($scope.SalesGrid.data[i].Article != '') {

                if ($scope.SalesGrid.data[i].Discount == undefined | $scope.SalesGrid.data[i].Discount == 0 | $scope.SalesGrid.data[i].Discount == '') {
                    $scope.SalesGrid.data[i].Amount = $scope.SalesGrid.data[i].Price * $scope.SalesGrid.data[i].Qty
                }
                else {
                    $scope.SalesGrid.data[i].Amount = ($scope.SalesGrid.data[i].Price * $scope.SalesGrid.data[i].Qty) * (100 - $scope.SalesGrid.data[i].Discount)/100
                }
                
             
                $scope.TotalOrder += $scope.SalesGrid.data[i].Amount;

            }
        }
    }

    function CalculatePaid() {

        $scope.TotalPaid = 0;

        for (var i = 0; i < $scope.PaymentGrid.data.length; i++) {
            if ($scope.PaymentGrid.data[i].Amount != '') {
                $scope.TotalPaid = $scope.TotalPaid + parseFloat($scope.PaymentGrid.data[i].Amount);

            }
        }

    }

    function FindArticle(Article) {
        

        for (var i = 0; i < $scope.ArticleData.length; i++) {
            if ($scope.ArticleData[i].Article == Article) {
                return $scope.ArticleData[i];
                
            }
        }
    }

    function ClearOrder() {
        $scope.SalesGrid.data = [];
        for (var i = 0; i < 30; i++) {
            $scope.SalesGrid.data[i] = { "Article": "", "Description": "", "Qty": "", "Price": "", "Discount": "", "Amount": "" };

        }
    }

    function ClearPay() {
        $scope.PaymentGrid.data = [];
        for (var i = 0; i < 15; i++) {
            $scope.PaymentGrid.data[i] = { "Type": "", "CardNo": "", "Amount": "" };

        }
    }

    // Data 

    function GetArticleData(strFile) {
        
       
        melvinLib.ReadData('ArticleMaster.json')
                                                        .then(
                                                            function (strResponse) {
                                                                $scope.ArticleData = strResponse;
                                                            },
                                                            function (strErrMsg) {
                                                               alert("Error Reading Article File" + strErrMsg);
                                                            }
                                                        )

    }



    

});
