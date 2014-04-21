Static
======

This what I use to build `my site <http://www.brianspeir.com>`_.

Maybe you will like it.

Develop. Stage. Deploy

::

    .
    │
    │
    ├── derived                   <--- Intermediates, temp, cache, etc...
    │   │
    │   ├── cache
    │   │
    │   └── build
    │       │
    │       ├── intermediates     <--- Processed HTML, images and stylesheets...
    │       │
    │       └── resources         <--- Everything ready to deploy.
    │
    │
    ├── documents                 <--- Document all the things.
    │   │
    │   .
    │
    ├── static                    <--- Most code goes here.
    │   │
    │   ├── fonts
    │   │   │
    │   │   .
    │   │
    │   ├── images
    │   │   │
    │   │   .
    │   │
    │   ├── other
    │   │   │
    │   │   .
    │   │
    │   ├── scripts               <--- Interaction and behavior.
    │   │   │
    │   │   ├── vendor            <--- Vendor scripts.
    │   │   │   │
    │   │   │   .
    │   │   │
    │   │   ├── base.js
    │   │   │
    │   │   └── plugins.js
    │   │
    │   ├── stylesheets           <--- Definition and presentation.
    │   │   │
    │   │   .
    │   │
    │   ├── templates             <--- Organization and structure.
    │   │   │
    │   │   .
    │   │
    │   └── index.html            <--- Definition and presentation.
    │
    ├── node_modules              <--- Local Node modules.
    │   │
    │   .
    │
    ├── tests                     <--- Tests.
    │   │
    │   .
    │
    ├── .gitignore
    │
    ├── .jshintrc                 <--- Rules for better scripts.
    │
    ├── AUTHORS
    │
    ├── CHANGELOG
    │
    ├── LICENSE
    │
    ├── Makefile                  <--- "Make'em Say UGH!"
    │
    ├── package.json              <--- Modify preferences here.
    │
    └── README.rst                <--- Tell us something about yourself.
