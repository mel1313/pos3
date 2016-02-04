app.controller("articleCtrl", function ($scope, $q, $timeout, $modalInstance, params, melvinLib) {

$scope.ArticleGrid = {
    enableFiltering: true,
    showSelectionCheckbox: true,
    multiSelect: false,
    enableFiltering: true,
    showColumnFooter: true,
    onRegisterApi: function (gridApi) {
        $scope.ArticleGriApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            var Article = {};
            Article.Sku = row.entity.Article;
            Article.Description = row.entity.Description;
            Article.Price = row.entity.Price;
            $modalInstance.close(Article);

        });

    }
}

var ArticlecolumnDefs = [
                  { field: 'Article', displayName: 'Sku', width: 200 },
                  { field: 'Description', displayName: 'Description', width: 400 },
                  { field: 'Price', displayName: 'Price', width: 100 }

];

$scope.ArticleGrid.columnDefs = ArticlecolumnDefs;

$scope.ArticleGrid.data = params;





});
