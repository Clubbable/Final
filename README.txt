P4 WriteUp

What: The project created is a very simple maze FPS shooter. It involves a first person camera walking around shooting 
at "crabs". The main advanced feature implemented is the collision detection. There are camera-wall collision, camera-crab collision
and bullet-crab collision detections.

How: The main data structures implemeneted are abstractions for the crabs and bullets. Those objects are wrapped in classes
that allow for them to be easily generated, and much of collision handling for those objects are wrapped in their own classes.
Another major part is mapping the map and its actors into a 2D array. Enemy placements, camera placement and map are all 
loaded into a 2D array such that it is easy for the map to be changed and tested.

HowTo: It is intuitive to play this game. The basic movement controls are up, down, left and right arrows. Mouse left clicks 
for shooting and mouse movements for looking at different areas. The "spacebar" allows for reseting the camera. It is used
whenever the camera gets a bit buggy.

Sources: 
1. http://www.isaacsukin.com/news/2012/06/how-build-first-person-shooter-browser-threejs-and-webglhtml5-canvas

Borrowed ideas of a 2D array map from, as well as some of the collision detection mechanisms. Additionally, 
the Radar is also borrowed from here

2. http://threejs.org/examples/ 

Main things borrowed from are the HUD and raytracing
