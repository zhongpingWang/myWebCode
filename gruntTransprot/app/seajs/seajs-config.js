seajs.config({
    base: "/dist/", 
    alias: {  
    	"comm":"modules/comm/comm.js"
    },
    map: [
         [/^(.*\.(?:css|js|htm))(\?.*)?$/i, '$1?2015083101']
    ]
});

