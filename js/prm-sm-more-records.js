angular.module('viewCustom').controller('prmSmMoreRecords', ['$timeout', 'customService', 'customGoogleAnalytic', '$q', 'prmSearchService', function ($timeout, customService, customGoogleAnalytic, $q, prmSearchService) {
    /** 
     * A starting point for clients to be able to affect and use additional records
     * in the brief record display.
     * 
     * options
     * omitFirstResult  Boolean
     *  true: removes the first result from each holdings list - so far has always been
     *  a duplicate in brief testing.
     *  false: allows the possible duplicate to be displayed
     * 
     * availableOnly  Boolean
     *  true: Filters results that do not have the status of available.
     *  NB: Overwrites vm.whitelist.statusCodes
     * 
     * vm.whitelist Object
     *  string additions to the lists within each list will only display records
     *  that have the provided values corresponding
     *     libraryCodes  Array: codes that new primo internally uses to determine displayed name
     *     sublocations: codes that new primo internally uses to determine displayed name
     *     statusCodes: codes that new primo internally uses to determine displayed name
     *     _availableOnlyCodes: internally used for options.availablOnly flag
     * 
     * Granular Filter Control Example:
     * 
     *
     *  var options = {
     *      omitFirstResult: false,     // shows every record including duplicates
     *      availableOnly: false,       // now uses vm.whitelist.statusCodes
     *  };
     * 
     *  vm.whitelist = {
     *      libraryCodes: ['WID', 'GEN', 'WIDLC']
     *      subLocations: ['GEN', 'Old Widener', 'LAM']
     *      statusCodes: ['available', 'available_at_institution','check_holdings', 'unavailable']
     *      _availableOnlyCodes: ['available', 'available_at_institution'],
     *  };
    */
    var vm = this;
    
    var options = {
        omitFirstResult: true,
        availableOnly: false, 
    };

    vm.whitelist = {
        libraryCodes: [],
        subLocations: [],
        statusCodes: [],
        _availableCodes: ['available', 'available_at_institution'],
    };
        
    vm.delivery = this.parentCtrl.result.delivery;
    if (vm.delivery.holding.length > 0) {
        vm.sm_holdings = vm.delivery.holding.map(function (entry, i) {
            entry.toTranslate = entry.libraryCode;
            entry.subLocation = entry.subLocation;
            entry.callNumber = entry.callNumber;
            entry.availabilityStatus = entry.availabilityStatus;
            entry.availability = vm.parentCtrl.getPlaceHolders(entry);
            entry.availabilityDisplay = function () {
                // could not find hook to get display text, so this tries to leverage
                // the built in translate directive that gets some of the display text but not all
                return 'delivery.code.' + entry.availabilityStatus;
            };
            return entry;
        })
        .filter(function (entry, i) {
            if (options.omitFirstResult && i === 0) {
                return false;
            }
            if (options.availableOnly && vm.whitelist._availableCodes.length > 0 && entry.availabilityStatus) {
                if (!vm.whitelist._availableCodes.includes(entry.availabilityStatus)) return false;
            }
            if (vm.whitelist.libraryCodes.length > 0 && entry.libraryCode) {
                if (!vm.whitelist.libraryCodes.includes(entry.libraryCode)) return false;
            }
            if (vm.whitelist.subLocations.length > 0 && entry.subLocation) {
                if (!vm.whitelist.subLocations.includes(entry.subLocation)) return false;
            }
            if (vm.whitelist.statusCodes.length > 0 && entry.availabilityStatus) {
                if (!vm.whitelist.statusCodes.includes(entry.availabilityStatus)) return false;
            }
            return true;
        });
    }

    vm.onCustomLinkClick = function (availability) {
        // your link click code goes here.
        return false;
    };
}]);

angular.module('viewCustom').component('prmSmMoreRecords', {
    bindings: { parentCtrl: '<' },
    controller: 'prmSmMoreRecords',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/HVD2/html/prm-sm-more-records.html'
});