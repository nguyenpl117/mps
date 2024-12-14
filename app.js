import fetch from 'node-fetch';
import fs from 'node:fs';
import { DOMParser } from 'xmldom';
import jsdom from 'jsdom';
import parser from 'xml-js';

const relations = JSON.parse(fs.readFileSync('./osm/relations.json', 'utf-8'));
const all = [];
for (const item of relations) {
    item.children.map(x => {
        all.push(x)
        return {}
    })
}
// for (const item of all) {
//     fetch(`https://www.openstreetmap.org/api/0.6/relation/${e.id}/full`)
//         .then(res => res.text())
//         .then(res => {
//             const parser = new DOMParser();
//             const xmlDoc = parser.parseFromString(res, 'text/xml');
//         })
// }
function fetchData(id, index) {
    // https://www.openstreetmap.org/api/0.6/relation/${id}/full
    fetch(`https://iphub.vn/wp-content/themes/mps/osm/${id}.txt`)
        .then(res => res.json())
        .then(res => {
            // const k = parser.xml2json(res, {compact: true, spaces: 4});
            // // console.log(JSON.parse(k).osm.node)
            //
            // const object = {
            //     type: 'GeometryCollection',
            //     geometries: [
            //         {
            //             type: "MultiPolygon",
            //             coordinates: [[]],
            //         }
            //     ]
            // }
            // const nodes = JSON.parse(k).osm.node;
            //
            // for (const item of nodes) {
            //     object.geometries[0].coordinates[0].push([item._attributes.lon, item._attributes.lat]);
            // }

            fs.writeFile(`./osm/${id}.json`, JSON.stringify(res), () => {

            });
            fetchData(all[index + 1].id, index + 1);
        })
}

fetchData(all[0].id, 0);
