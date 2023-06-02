
ymaps.ready(init);

function init() {
    var geolocation = ymaps.geolocation,
        myMap = new ymaps.Map('map', {
            center: [55, 34],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

    
    geolocation.get({
        provider: 'yandex',
        mapStateAutoApply: true
    }).then(function (result) {
        // Красным цветом пометим положение, вычисленное через ip.
        result.geoObjects.options.set('preset', 'islands#redCircleIcon');
        result.geoObjects.get(0).properties.set({
            balloonContentBody: 'Мое местоположение'
        });
        myMap.geoObjects.add(result.geoObjects);
    });

    geolocation.get({
        provider: 'browser',
        mapStateAutoApply: true
    }).then(function (result) {
        
        result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                result.geometry.getCoordinates(),
                $('#address').text()
            ],
            params: {
                
                routingMode: 'pedestrian'
            }
        }, {
            // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
            boundsAutoApply: true
        });
        myMap.geoObjects.add(multiRoute);
        myMap.geoObjects.add(result.geoObjects);
    });
    

ymaps.geocode($('#address').text(), {
        results: 1
    }).then(function (res) {
            
            var firstGeoObject = res.geoObjects.get(0),
                coords = firstGeoObject.geometry.getCoordinates(),
                bounds = firstGeoObject.properties.get('boundedBy');
            firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
            firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());
            myMap.geoObjects.add(firstGeoObject);
            myMap.setBounds(bounds, {
                checkZoomRange: true
            });
            console.log('Все данные геообъекта: ', firstGeoObject.properties.getAll());
            console.log('Метаданные ответа геокодера: ', res.metaData);
            console.log('Метаданные геокодера: ', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData'));
            console.log('precision', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.precision'));
            console.log('Тип геообъекта: %s', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.kind'));
            console.log('Название объекта: %s', firstGeoObject.properties.get('name'));
            console.log('Описание объекта: %s', firstGeoObject.properties.get('description'));
            console.log('Полное описание объекта: %s', firstGeoObject.properties.get('text'));
            console.log('\nГосударство: %s', firstGeoObject.getCountry());
            console.log('Населенный пункт: %s', firstGeoObject.getLocalities().join(', '));
            console.log('Адрес объекта: %s', firstGeoObject.getAddressLine());
            console.log('Наименование здания: %s', firstGeoObject.getPremise() || '-');
            console.log('Номер здания: %s', firstGeoObject.getPremiseNumber() || '-');

        });

}
