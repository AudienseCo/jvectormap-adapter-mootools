jvectormap-adapter-mootools
===========================

Mootools adapter for jVectorMap library

###Create the map
```javascript
//set the adapter
jvm.adapter.mootools.use();

//add the map
jvm.WorldMap.addMap('world_mill_en', jvm.getWorldMillEn());

//create the map
var map = new jvm.WorldMap({
  container: jvm.$('#map1'),
  map: 'world_mill_en',
  series: {
    ....
  }
})
```

###Interact with map
```javascript
$('focus-single').addEvent('click', function(){
  map.set('focus', 'AU')
});

$('focus-multiple').addEvent('click', function(){
  map.set('focus', ['AU', 'JP']);
});

$('focus-init').addEvent('click', function(){
  map.set('focus', 1, 0, 0);
});
