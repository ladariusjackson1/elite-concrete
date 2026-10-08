# Elite Concrete Solutions — concept site

This is a demo website, not a real concrete business. It is a sales sample for an AI-receptionist website (a “talking website”): the kind of site a contractor could publish, with a chat widget that can talk to visitors.

The phone number, email, hours, reviews, and photos are placeholders. The estimate form calculates a sample volume and then stops. It does not send a lead.

Search engines are asked not to index the page (`noindex`).

## What it shows

- **3D scroll scene.** A slab is graded, reinforced, poured, finished, and cured as you scroll. The scene is drawn with Three.js and stays fixed behind the page.
- **Concrete volume estimator.** Length, width, and thickness produce area, cubic yards (with 10% waste), and truck loads.
- **Open-hours indicator.** The mobile call bar marks the sample schedule as open or closed: Monday to Friday, 8am to 6pm Central.
- **Chat widget.** A LeadConnector widget is embedded at the bottom of the page as the stand-in for the AI receptionist.

The page also includes a project gallery with a lightbox, a horizontal services collection, and a short set of sample quotes.

## View it

Live sample: [https://ladariusjackson1.github.io/elite-concrete/](https://ladariusjackson1.github.io/elite-concrete/)

Locally, from this folder:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080/](http://localhost:8080/).

Use a local server rather than opening `index.html` as a file. The 3D scene, fonts, and chat widget load from the network, so the browser needs an internet connection.

Photos live in `images/` and are referenced from `index.html`. The page itself is a single static file.
