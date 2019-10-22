# Polydraw-Project2
Second university development project. Run commands "npm install" then "npm start" under client folder to view website. Currently only in French.

Currently undergoing second sprint. This will introduce server for saving, editing, and filtering drawings, the ability to select objects, new shapes (Line, Ellipse, Polygon), and new tools (Eyedropper, Stamp)

Following features were implemented during first sprint:

  - The skeleton for the UI

  - A welcome message which can disabled upon further visits (Nice-to-have: display a tutorial)

  - The ability to create a new drawing by defining width, height, and background color (Either through a palette, RGBA, or Hexadecima
  color values). Form dimensions are auto-ajusted to workspace dimensions until user inputs are detected.

  - A canvas for drawing and inserting shapes

  - A pencil tool under which the drawing width can be adjusted

  - A paintbrush tool under which the drawing width can be adjusted. Choice of 5 seperate textures are implemented, the first currently  
  being the pencil texture (Because eventually, user will be able to define the "splash" ratio of the paintbrush).

  - A shapes tool under which the user can currently insert a rectangle. The border width can be defined.

  - A color tool which is always displayed at the bottom of the properties section. User can define primary and secondary colors, switch 
  these colors, define their transparency, and change background color. Tool also displays last ten colors used.

  - A color applicator tool. This applies current primary and secondary colors to clicked objects
  Curent shortcuts:

Ctrl+O: Create new drawing
C: Pencil
W: Paintbrush
1: Rectangle
R: Color applicator
