# "Sunset Inspo"

A Laptop Ensemble artefact created as part of the _LENS_ ANU Laptop Ensemble '21
cohort.

<https://cs.anu.edu.au/courses/comp2710-lens/deliverables/lens-performance/>

## Description

![The sunset at Canberra by Yichen Wang](./p5js-osc-master/visual_js/cloud.png)
The sunset at Canberra by Yichen Wang - Nov, 2020

My work uses Extempore to produce ambient music in run-time, with complementary visuals that respond to the theme of the ambient music. My work was inspired by the sunset at Canberra which I noticed when I walk up mountains every time. I found the moment of seeing the sun goes down is fascinating. I thus decided to transform such a beautiful scene into a laptop ensemble piece represented by computer music and visuals. 

For the music part, pre-defined music patterns were implemented, mainly consisting of an ambient base, drums that add up the complexity, and appoggiatura and rhythms that let the music focus. The whole music is built up by playing patterns progressively, with the flexibility of tuning patterns' parameters to change the music based on users' needs.

For the visuals, it is composed of different "states" to introduce the theme of my music "sunset". The visuals should start with the image of sunset, with pixeling and dissolution effect to decompose the image and turns into a different "dimension" - presenting a different representation of the sunset. Different parameters can be tuned to change the visuals. The visuals eventually map back to the beginning, with the pixeling and dissolution.

## Usage

The work, including music and visuals, is all evoked/controlled in the Extempore file _final-instrument.xtm_. Although the source code of music and visuals were implemented in different files:
- Extempore file _final-instrument.xtm_ that control music
- Javascript file _sketch.js_ for visuals in folder [p5js-osc-master/visual_js](./p5js-osc-master/visual_js)

For usage, you can either solely playing around the music of my work in the _final-instrument.xtm_ - like what you normally do in Extempore. Or you can have multiple people playing different music patterns in the _final-instrument.xtm_ from different end to compose an integrated ambient music piece. (The way of doing this is to use one person as the main server , others evoke 
    
    Extempore: Connect to host:port

    
command and input that person's IP address. Then you will do the same playing music patterns in Extempore as usual, but the music will be played from that server's laptop).

Additionally, you can also have visuals played dynamically with the music at the same time. My work offers different parameters can be tuned to achieve different visualisations such as particle effect, image pixeling, etc. More info about visual options can be found in _final-instrument.xtm_ regarding its usage, or check out the visuals source code in _sketch.js_.

To enable visuals, you need to configure oscP5 with P5.js together before actually running visuals on web browser. Given the work was achieved by P5.js and runs on web browser, and uses oscP5 to set up the communication between Extempore and Js, so that you can dynamically tune parameters of visuals. 

To set up P5.js and oscP5' s communication, you need to:
- Install oscP5 under Processing directory
- Put the whole _p5js-osc-master_ file under the Processing directory in your system
- Set up the P5.js and oscP5 following the [README.md](./p5js-osc-master/README.md) in p5js-osc-master

The js file set-up should look up like this in your Processing directory:

    - Processing
        - libraries
            - controlP5
            - oscP5
        - p5js-osc-master
            - visual_js
                - sketch.js
                - index.html
                - libraries
            - bridge.js
            - other files

Once this has been set up, you can load the _sketch.js_ file by first evoking this command

    $ node bridge.js

and open Live Sever (assuming you are using VScode) through _index.html_

And now you can start Extempore file _final-instrument.xtm_ to play around visuals shown on the browser. Noted, the _final-instrument.xtm_ doesn't need to be in the same dir with visual files. They only need to be in the same laptop to achieve local osc message communication.

In _final-instrument.xtm_, this piece code is in charge of OSC communication/visuals options:

First, you should set up the connection. You can then change the states and different parameters for visualisation. More info can be found in _final-instrument.xtm_.

    //set up osc connection with js
    (define (osc-receive-handler timestamp address . args)
        (println 'osc-receive-handler address '-> args))
    
    (io:osc:start-server 8000 "osc-receive-handler")

    //send messages to js for controlling different parameter

    (io:osc:send (now) (cons "localhost" 12000) "/temp"  *temp* )

    (io:osc:send (now) (cons "localhost" 12000) "/vcount"  *vcount* )

    (io:osc:send (now) (cons "localhost" 12000) "/state"  "lead")

    (io:osc:send (now) (cons "localhost" 12000) "/ccount"  *ccount* )

    (io:osc:send (now) (cons "localhost" 12000) "/csize"  *csize* )

    (io:osc:send (now) (cons "localhost" 12000) "/scale"  *scale* )

    (io:osc:send (now) (cons "localhost" 12000) "/flag" 1)

    (io:osc:send (now) (cons "localhost" 12000) "/test/msg"  "" )

There is also a post having more info about setting up with OSC and Extempore by Ben, you can [read](https://benswift.me/blog/2020/04/30/two-way-osc-communication-between-extempore-and-pd/) it.

Please feel free to contact me: [yichen.wang@anu.edu.au](yichen.wang@anu.edu.au) if you have any questions.

## Licence

Copyright (C) 2021 Yichen Wang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
