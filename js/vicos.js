/*!
 * Vicos - Vertical Content Slider
 * (c) 2021 Dennis Dobirr, MIT License, https://breakpoint-media.de
 */
var vicos = (function () {

	'use strict';

	//
	// Variables
	//
	let api = {};
    let getElemetsDOM;
    let getVicosStage;

    api.data = {};
    api.data.content = [];
    api.data.scale = {};


	//
	// Methods
	//
    function isVisible (ele) {
        const { top, bottom } = ele.getBoundingClientRect();
        const vHeight = (window.innerHeight || document.documentElement.clientHeight);
    
        return (
        (top > 0 || bottom > 0) &&
        top < vHeight
        );
    }
    function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
        var ratio = Math.max(maxWidth / srcWidth, maxHeight / srcHeight);
        return { width: srcWidth * ratio, height: srcHeight * ratio };
    }

		
	/**
	 * INIT METHOD
	 */
	api.init = function () {

        // Wenn keine Elemente vorhanden return
        if(!document.querySelectorAll('.vicos')) return;

         // Alle Vicos elemente laden und in Array konvertieren
         getElemetsDOM = Array.prototype.slice.call(document.querySelectorAll('.vicos'));

         // Alle Vicos elemente durchlaufen und inhalte aufteilen
         getElemetsDOM.forEach(function(vicos, index) {            

            // Erstelle pro Vicos -> Image, Content Array
            let images = [];
            let contents = [];

            // Finde alle Children von Vicos und in Array konvertieren
            let getChildren = Array.prototype.slice.call(vicos.children);

            // Zerlege Children und teile in zwei Arrays (Images, Contens)
            for(let vicosChild of getChildren) {

                // Teile Image von Contnet und speicher temporar
                let getImage = vicosChild.querySelector('img');

                // Lösche Image
                getImage.parentNode.removeChild(getImage);

                // Speicher Contnet temporar
                let getContent = vicosChild.innerHTML;

                // Push Images und Contens in Array
                images.push(getImage);
                contents.push(getContent);

            };

            // Push alle Inhalte in api.data          
            api.data.content.push({
                // index: index,
                images: images,
                contents: contents
            });
            

            // Lösche alle Inhalte in Vicos DOM
            vicos.innerHTML = "";
            
        })
       
		api.render();
        
	};


    /**
	 * RENDER METHOD
	 */
	api.render = function () {

        // Iteriere durch alle Vicos DOM Elemenete
        getElemetsDOM.forEach(function(vicosElem, index) {  

            // Durchlaufe api.data und integriere Content
            for(let singleContent of api.data.content[index].contents) {

                // Erstelle Content Container
                let vicosContentContainer = document.createElement('div');
                vicosContentContainer.classList.add('content-wrap');

                // Erstelle inneren Content Container und lade Content Inhalte
                let vicosContentInner = document.createElement('div');
                vicosContentInner.classList.add('content-inner');
                vicosContentInner.innerHTML = singleContent;

                // Füge inneren Content in Content Container ein
                vicosContentContainer.append(vicosContentInner);

                // Inject HTML in DOM
                vicosElem.append(vicosContentContainer);
                
            }

            // Setze data attribut zu späteren Indexierung
            vicosElem.setAttribute('data-vicos-index', index);





            // Viewport einbauen für getElemetsDOM
            document.addEventListener("scroll", function () {
                if(isVisible(vicosElem)) {
                    if(checkIndex != index) {
                        console.log(vicosElem.getAttribute('data-vicos-index'));
                    }
                } 
            });



            
        });

         // Basis Vicos breite und höhe ermittel und in api.data.scale setzen
         api.data.scale.width = getElemetsDOM[0].clientWidth;
         api.data.scale.height = window.innerHeight;  
         
         
         // Erstelle Vicos Stage
        // Stage
		getVicosStage = document.createElement('div');
        getVicosStage.classList.add('vicos-stage');
      

        // Füge Vicos Stage in Body ein
        document.body.append(getVicosStage);








        

       










        // Update ausführen und auf Resize Listenen
        api.update();
        window.addEventListener('resize', function() {
            api.update();
        }, false);

	};


    /**
     * UPDATE METHOD
     */
    api.update = function () { 


        // Vicos Stage berechne die Ausgabeverhältnis
        Object.assign(getVicosStage.style,  {
            'position': 'fixed',
            'top': 0,
            'left': ((window.innerWidth / 2) - (api.data.scale.width / 2)) - 8 + 'px',
            'width': api.data.scale.width + 'px',
            'height': api.data.scale.height + 'px',
            'overflow': 'hidden',
            'opacity': 0
        }); 



        // Lade 1. Pallete von Images in vicos-stage
        for(let image of api.data.content[0].images) {

            // berechne das Ausgabeverhältnis und position des Images
            let ration;
            setTimeout(function() { // ACHTUNG NOCH KONTROLLIEREN, WARUM setTimeout??? !!!!!!!!!!!!!!!!!
                ration = calculateAspectRatioFit(image.clientWidth, image.clientHeight, api.data.scale.width, api.data.scale.height);
                
                Object.assign(image.style,  {
                    'position': 'absolute',
                    'top': 0,
                    'left': -(ration.width - api.data.scale.width) / 2 + 'px',
                    'width': ration.width + 'px',
                    'height': ration.height + 'px'
                }); 
            }, 10);

            // Nach setTimeout schalte Vicos Stage sichtbar
            getVicosStage.style.opacity = 1;


            getVicosStage.append(image);
        }




        console.log(api)

    }


	//
	// Return the Public APIs
	//

	return api;

})();



vicos.init();