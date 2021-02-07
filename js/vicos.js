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
    let currentVicosIndex;
    let lastVicosIndex;
    let currentSlideElemIndex;
    let lastSlideElemIndex;
    let currentScrollDirection;

    api.data = {};
    api.data.content = [];
    api.data.scale = {};

    // Ermittel aktuelle Y Koordinate des window objects
    document.addEventListener("scroll", function () {
        currentScrollDirection = window.scrollY;


        document.querySelector('#log').textContent = currentScrollDirection;
    })


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
                getImage.classList.add('vicos-image');

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

            let slideIndex = 0;
            // Durchlaufe api.data und integriere Content
            for(let singleContent of api.data.content[index].contents) {

                // Erstelle Content Container
                let vicosContentContainer = document.createElement('div');
                vicosContentContainer.classList.add('content-wrap');

                // Erstelle inneren Content Container und lade Content Inhalte
                let vicosContentInner = document.createElement('div');                
                vicosContentInner.classList.add('content-inner');
                vicosContentInner.setAttribute('data-slide-index', slideIndex);
                vicosContentInner.innerHTML = singleContent;

                // Füge inneren Content in Content Container ein
                vicosContentContainer.append(vicosContentInner);

                // Inject HTML in DOM
                vicosElem.append(vicosContentContainer);

                slideIndex++;
                
            }

            // Setze data attribut zu späteren Indexierung
            vicosElem.setAttribute('data-vicos-index', index);

            // Setze data attribut für späteren lock
            vicosElem.setAttribute('data-vicos-active', false);


            // ermittel eingang - top oder bottom und wandel in int um
            // const top = parseInt((vicosElem.getBoundingClientRect().top - window.outerHeight).toFixed()) ;
            // const bottom = parseInt(vicosElem.getBoundingClientRect().bottom + vicosElem.clientHeight.toFixed());
            

            // Viewport einbauen für jedes Vicos Element
            document.addEventListener("scroll", function () {

                
               //console.log('top: ' + top + ' | bottom: ' + bottom + ' | Current: ' + currentScrollDirection);


                // if(currentScrollDirection >= top && currentScrollDirection <= top +  100) {
                //     console.log('top');
                // }
                // if(currentScrollDirection >= bottom && currentScrollDirection <= bottom +  100) {
                //     console.log('bottom');
                // }

                if(isVisible(vicosElem)) {
                    
                                 
                    // setze currentVicosIndex auf akzuellen in index
                    currentVicosIndex = vicosElem.getAttribute('data-vicos-index');

                    if(lastVicosIndex !== currentVicosIndex) {
                        
                        // api.next einmal ausführen mit nächstem parameter
                        api.next(currentVicosIndex);

                        // Setze alle data-vicos-active auf false und aktiven data-vicos-active auf true
                        for(let vico of getElemetsDOM){
                            vico.setAttribute('data-vicos-active', false);
                        }
                        vicosElem.setAttribute('data-vicos-active', true);                        

                        // ermöglichen das pro vicos api.next nur einmal ausgeführt wird
                        lastVicosIndex = currentVicosIndex;

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

         // Aktuelle Vicos breite und höhe ermittel und in api.data.scale setzen
         api.data.scale.width = getElemetsDOM[0].clientWidth;
         api.data.scale.height = window.innerHeight;


        // Vicos Stage berechne die Ausgabeverhältnis
        Object.assign(getVicosStage.style,  {
            'position': 'fixed',
            'top': 0,
            'left': ((window.innerWidth / 2) - (api.data.scale.width / 2)) - 8 + 'px',
            'width': api.data.scale.width + 'px',
            'height': api.data.scale.height + 'px',
            'overflow': 'hidden'            
        }); 

         // Lade aktuelle Pallete von Images in vicos-stage
         for(let image of getVicosStage.children) {

            // berechne das Ausgabeverhältnis und position des Images
            let ration = calculateAspectRatioFit(image.clientWidth, image.clientHeight, api.data.scale.width, api.data.scale.height);
            
            Object.assign(image.style,  {
                'position': 'absolute',
                'top': 0,
                'left': -(ration.width - api.data.scale.width) / 2 + 'px',
                'width': ration.width + 'px',
                'height': ration.height + 'px',
                'z-index': 1
            }); 
        

            // Nach setTimeout schalte Vicos Stage sichtbar
            getVicosStage.style.opacity = 1;

        }

    }

    /**
     * NEXT METHOD
     */
    api.next = function (step) { 

        // Lehre den aktuellen Vicos Stage
        getVicosStage.innerHTML = '';

        // Aktive aktuelle Pallete von Images in vicos-stage
        api.data.content[step].images.forEach(function(image, index){
            image.setAttribute('data-image-index', index);             
            getVicosStage.append(image);
        });
      

        api.update();

        api.slide(step);

    }

    /**
     * NEXT METHOD (Switch Images)
     */
    api.slide = function(step) {

        // Lade alle Slide Elemente die im Viewport sind
        let getSlides = Array.prototype.slice.call(getElemetsDOM[step].querySelectorAll('.content-inner'));

        let getSlideImages = Array.prototype.slice.call(getVicosStage.children);

        
        getSlides.forEach(function(slideElem, index) {


            document.addEventListener("scroll", function () {

                if(isVisible(slideElem)) {
                    
                                 
                    // setze currentVicosIndex auf akzuellen in index
                    currentSlideElemIndex = slideElem.getAttribute('data-slide-index');
    
                    if(lastSlideElemIndex !== currentSlideElemIndex) {


                        for(let image of getSlideImages) {
                            image.classList.remove('active');
                            Object.assign(image.style,  {
                                'z-index': 1,
                            }); 
                        }
                        Object.assign(getSlideImages[currentSlideElemIndex].style,  {
                            'z-index': 2,
                        }); 

                        getSlideImages[currentSlideElemIndex].classList.add('active');
                     
                        lastSlideElemIndex = currentSlideElemIndex;
    
                    }
                        
                  
                } 
            });


        })

    }


	//
	// Return the Public APIs
	//

	return api;

})();




vicos.init();