(function () {
    'use strict';
    if (history && 'replaceState' in history) {
        history.replaceState(null, null, location.href.split('#')[0]);
    } else {
        location.hash = '';
    }
})();