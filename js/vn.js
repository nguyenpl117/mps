class ControllerAPI {
    static getRelations() {
        return fetch('./osm/relations.json')
            .then(res => res.json());
    }

    static getSvgMap(key) {
        return fetch(`./img/${key}.svg`)
            .then(res => res.text());
    }

    static getGeoJSON(id) {
        return fetch(`./osm/${id}.json`)
            .then(res => res.json());
    }

    static getAllLogistic() {
        return fetch(`./osm/logistic.json`)
            .then(res => res.json());
    }

    static getIndustry(id) {
        return fetch(`./osm/industry.json`)
            .then(res => res.json());
    }

    static getPin(id) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, 500)
        })
    }
}
document.addEventListener('alpine:init', function () {
    let map,v;
    Alpine.data('mps', () => {
        return {
            regions: [
                {
                    name: 'Bắc trung bộ',
                    key: 'bac-trung-bo',
                    fill: 'rgb(244, 200, 131)',
                    hoverFill: 'rgb(250,175,59)',
                    id: 3770501
                },
                {
                    name: 'Đông bắc bộ',
                    key: 'dong-bac-bo',
                    fill: 'rgb(159, 217, 146)',
                    hoverFill: 'rgb(71,152,53)',
                    id: 3770517
                },
                {
                    name: 'ĐB sông cửu long',
                    key: "dong-bang-song-cuu-long",
                    fill: 'rgb(253, 189, 196)',
                    hoverFill: 'rgb(246,129,143)',
                    id: 3771291
                },
                {
                    name: 'ĐB sông hồng',
                    key: "dong-bang-song-hong",
                    fill: 'rgb(253, 189, 196)',
                    hoverFill: 'rgb(236,80,98)',
                    id: 3769301
                },
                {
                    name: "Đồng nam bộ",
                    key: 'dong-nam-bo',
                    fill: 'rgb(159, 217, 146)',
                    hoverFill: 'rgb(85,224,55)',
                    id: 3770621
                },
                {
                    name: "Nam trung bộ",
                    key: 'nam-trung-bo',
                    fill: 'rgb(143, 180, 238)',
                    hoverFill: 'rgb(82,147,246)',
                    id: 3770591
                },
                {
                    name: "Tây bắc bộ",
                    key: 'tay-bac-bo',
                    fill: 'rgb(119, 193, 241)',
                    hoverFill: 'rgb(68,169,234)',
                    id: 3770582
                },
                {
                    name: "Tây nguyên",
                    key: 'tay-nguyen',
                    fill: 'rgb(219, 147, 227)',
                    hoverFill: 'rgb(217,55,236)',
                    id: 3770609
                }
            ],
            relationSelected: null,
            provinceSelected: null,
            tooltipRegion: null,
            map: null,
            v: null,
            industry: [],
            showInfoProvince: false,
            showInfoPin: false,
            loading: false,

            isDragging: false,
            offsetX: 0,
            offsetY: 0,
            currentY: 0,
            swipeUp: false,
            resizeObserver: null,
            resizeObserverMap: null,
            init() {
                this.tooltipRegion = tippy(document.body, {
                    content: 'Loading...',
                    followCursor: true,
                    allowHTML: true,
                    theme: 'slash-command',
                    appendTo: document.body,
                    trigger: 'manual',
                    onShow(instance) {
                        const slug = instance.reference.id;
                        setTimeout(() => {
                            instance.setContent(`
                        <div class="flex flex-col gap-2">
                        <div class="px-2"><strong>Đồng bằng sông cửu long</strong></div>
                        <table>
                        <tr><td class="px-2 py-1">Số KCN</td><td>88</td></tr>
                        <tr><td class="px-2 py-1">Dân số</td><td>88</td></tr>
                        <tr><td class="px-2 py-1">Diện tích</td><td>88</td></tr>
                        <tr><td class="px-2 py-1">Số tỉnh</td><td>88</td></tr>
                        <tr><td class="px-2 py-1">Sân bay quốc tế</td><td>88</td></tr>
                        <tr><td class="px-2 py-1">Sân bay nội địa</td><td>88</td></tr>
                        <tr><td class="px-2 py-1">Cảng biển</td><td>Loại I, Loại II</td></tr></table>
                        </div>
                        `)
                        }, 500)
                    },
                });
                this.fetchRegions();
                this.onGoToVietnamMap();
                Fancybox.bind('[data-fancybox="gallery"]', {
                    //
                });

                document.addEventListener('mouseup', () => {
                    this.swipeMouseLeave()
                })
                document.addEventListener('touchend', () => {
                    this.swipeMouseLeave()
                })
                document.addEventListener('touchcancel', () => {
                    this.swipeMouseLeave()
                })

                this.resizeObserver = new ResizeObserver((entries) => {
                        for (const entry of entries) {
                            const width = entry.target.getBoundingClientRect().width;
                            if (width >= 1024) {
                                document.querySelector('#main-content').style.height = '';
                            }
                        }
                });

                this.resizeObserver.observe(document.querySelector('#mps-container'));

                // this.resizeObserverMap = new ResizeObserver((entries) => {
                //     for (const entry of entries) {
                //         let width = entry.target.getBoundingClientRect().width;
                //         if (width < 1000) {
                //             $(entry.target).find('svg')[0].style['transform'] = `scale(${width/1000})`
                //         } else {
                //             $(entry.target).find('svg')[0].style['transform'] = ``
                //         }
                //     }
                // });
                // this.resizeObserverMap.observe(document.querySelector('#map'))
            },
            destroy() {
                this.resizeObserver.disconnect();
                // this.resizeObserverMap.disconnect();
            },
            fetchRegions() {
                ControllerAPI
                    .getRelations()
                    .then(res => {
                        this.regions = res;

                        // this.onGotoRegionKey('bac-trung-bo');
                        // this.relationSelected = this.regions.find(x => x.key == 'bac-trung-bo')
                        // this.onGotoProvinceKey('thua-thien-hue');
                    })
            },
            onFocusRegion(key) {
                if (!document.querySelector(`#${key}`)) {
                    return;
                }
                const item = this.regions.find(x => x.key === key);
                document.querySelector(`#${key}`)
                    .style.fill = item.hoverFill
            },
            outFocusRegion(key) {
                if (!document.querySelector(`#${key}`)) {
                    return;
                }
                const item = this.regions.find(x => x.key === key);
                document.querySelector(`#${key}`)
                    .style.fill = item.fill
            },
            onHoverMap($el) {
                this.tooltipRegion.setProps({content: 'loading...'})
                this.tooltipRegion.show();
                this.onFocusRegion($el.target.id)
            },
            onLeaveMap($el) {
                this.tooltipRegion.hide();
                this.outFocusRegion($el.target.id);
            },
            onHoverProvince($el) {
                this.tooltipRegion.setProps({content: 'loading...'})
                this.tooltipRegion.show();
                $el.target.style.fill = 'rgb(153, 158, 255)';
            },
            onLeaveProvince($el) {
                this.tooltipRegion.hide();
                $el.target.style.fill = 'rgb(253, 189, 196)';
            },
            onGotoProvince($el) {
                this.onGotoProvinceKey($el.target.id);
                $("#mps-list-province").val($el.target.id)
            },
            onGotoProvinceKey(key) {
                // console.log('key', key)
                // this.clearLMap();
                // let map = this.map;
                // let v = this.v;

                if (!map) {
                    $("#map").html('');
                    map = L.map('map', {
                        center: [ 12.9962314,108.675894],
                        zoom: 7
                    });
                    // this.map = map;
                    // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
                    // L.tileLayer('https://api.ekgis.vn/v1/maps/vietnam/{z}/{x}/{y}.png?api_key=ojxo5NVYZoFGx0Wg74cmedol7dsulfrE9b1SwxSF', {
                    // L.tileLayer('https://maps.vnpost.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=8fb3246c12d442525034be04bcd038f22e34571be4adbd4c', {
                    L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
                        attribution: '&copy; <a target="_blank" href="https://maps.google.com">Google</a>',
                        subdomains:['mt0','mt1','mt2','mt3']
                    }).addTo(map);

                    ControllerAPI.getAllLogistic()
                        .then(res => {
                            for (const item of res) {
                                const a = './img/';
                                let s = a + 'default_marker.png';
                                if (item.cat.includes(1)) {
                                    s = a + 'iland.svg';
                                } else if (item.cat.includes(2)) {
                                    s = a + 'pin.png';
                                }

                                const myIcon = L.icon({
                                    iconUrl: s,
                                    iconSize: [24, 24],
                                    iconAnchor: [12, 24],
                                    popupAnchor: [0, -24]
                                });

                                const f = L.marker([item.acf.lat, item.acf.lng], {
                                    icon: myIcon
                                }).addTo(map);

                                f.bindTooltip('Quần Đảo Hoàng Sa', {
                                    permanent: false,
                                    direction: "top",
                                    offset: L.point(0, -30)
                                });
                                f.on('click', function () {
                                    // f.bounce(500);
                                    f.bounce({
                                        duration: 500,
                                        height: 100
                                    })
                                });
                            }
                        })
                }

                this.industry.forEach(x => {
                    x.unbindTooltip();
                    x.unbindPopup();
                    x.remove();
                });
                this.industry = [];
                this.loading = true;
                ControllerAPI.getIndustry(1)
                    .then(res => {
                        if (this.industry.length) {
                            return;
                        }
                        for (const item of res) {
                            const a = './img/';
                            let s = a + 'pin.png';

                            const myIcon = L.icon({
                                iconUrl: s,
                                iconSize: [30, 38],
                                iconAnchor: [15, 24],
                                popupAnchor: [0, -24]
                            });

                            const f = L.marker([item.acf.lat, item.acf.lng], {
                                icon: myIcon
                            }).addTo(map);

                            f.bindTooltip(item.title, {
                                permanent: false,
                                direction: "top",
                                offset: L.point(0, -30)
                            });
                            f.bindPopup(`
                            <div class="flex flex-col gap-1"><strong class="text-blue-900">${item.title}</strong>
                            <div><strong>Diện tích</strong>: 123ha</div>
                            <div><strong>Thời hạn</strong>: 43 năm</div>
                            </div>
                            `, {
                                offset: [0, 0],
                                autoClose: false
                            });
                            f.on('click', () => {
                                f.bounce({
                                    duration: 500,
                                    height: 100
                                })
                                map.flyTo([item.acf.lat, item.acf.lng], 14);
                                this.onGotoPinKey(item.id)
                            });
                            this.industry.push(f);
                        }
                    })
                    .finally(() => {
                        this.loading = false;
                    })

                const item = this.relationSelected.children.find(x => x.key == key);
                this.provinceSelected = item;
                if (item) {
                    ControllerAPI.getGeoJSON(item.id)
                        .then(res => {
                            if (v) {
                                v.remove();
                                v = null;
                            }
                            v = L.geoJSON(res, {
                                style: {
                                    color: "#dc2626",
                                    weight: 2,
                                    fillOpacity: .1
                                }
                            }).addTo(map);
                            map.fitBounds(v.getBounds(), {maxZoom: 9});
                        })
                }
            },
            onChangeProvince($el) {
                this.onGotoProvinceKey($($el.target).val());
            },
            clearLMap() {
                if (map) {
                    map.remove();
                    map = null;
                }
            },
            onGotoRegionKey(key) {
                $("#mps-list-province").val('')
                this.clearLMap();
                this.relationSelected = this.regions.find(x => x.key == key);
                this.provinceSelected = null;
                ControllerAPI
                    .getSvgMap(key)
                    .then(res => {
                        const elm = $(res)[0];

                        $(elm).find('path').each(function () {
                            if (this.className.baseVal) {
                                this.classList.add('mapsvg-region');
                                this.setAttribute('x-on:mouseenter', 'onHoverProvince')
                                this.setAttribute('x-on:mouseleave', 'onLeaveProvince')
                                this.setAttribute('x-on:click', 'onGotoProvince')
                            }
                        });
                        elm.style.width = '100%';
                        elm.style.height = '100%';

                        $("#map").html(elm);
                    })
            },
            onGotoRegion($el) {
                this.onGotoRegionKey($el.target.id);
            },
            onGotoPinKey(key) {
                this.loading = true;
                const item = {
                    "acf": {
                        "lng":107.1903783,
                        "lat":16.409854
                    }
                }
                v && v.setStyle({
                    fillOpacity: 0
                });
                ControllerAPI.getPin()
                    .then(() => {
                        this.showInfoPin = true;
                        map.flyTo([item.acf.lat, item.acf.lng], 14);
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },
            closePin() {
                map.flyTo(v.getBounds().getCenter(), 9);
                this.showInfoPin = false;
            },
            onGoToVietnamMap() {
                this.clearLMap();
                this.relationSelected = null;
                this.provinceSelected = null;
                ControllerAPI
                    .getSvgMap('vn_map')
                    .then(res => {

                        const elm = $(res)[0];

                        $(elm).find('path').each(function () {
                            if (this.className.baseVal) {
                                this.classList.add('mapsvg-region');
                                this.setAttribute('x-on:mouseenter', 'onHoverMap')
                                this.setAttribute('x-on:mouseleave', 'onLeaveMap')
                                this.setAttribute('x-on:click', 'onGotoRegion')
                            }
                        });
                        elm.style.width = '100%';
                        elm.style.height = '100%';
                        // elm.style['transform-origin'] = '0% 0%';
                        // elm.style['max-height'] = '100%';

                        $("#map").html(elm);
                    })
            },

            swipeMouseDown($el) {
                const dragElement = $el.target;

                this.isDragging = true;
                this.offsetX = $el.clientX - dragElement.getBoundingClientRect().left;
                this.offsetY = $el.clientY - dragElement.getBoundingClientRect().top;

                this.currentY = $el.clientY;

                document.body.style.cursor = 'grabbing';
            },

            swipeMouseMove($el) {
                if (this.isDragging) {
                    const regionsHeader = document.querySelector('#regions-header');
                    const swipeHandle = document.querySelector('#swipe-handle');
                    const content = document.querySelector('#main-content');

                    const height = window.innerHeight - $el.clientY;
                    const minHeight = (swipeHandle.getBoundingClientRect().height + regionsHeader.getBoundingClientRect().height);


                    if (height >= minHeight) {
                        content.style.height = `${height}px`;
                    }

                    this.swipeUp = this.currentY > $el.clientY;
                }
            },
            swipeMouseLeave() {
                if (!this.isDragging) {
                    return;
                }
                this.isDragging = false;
                document.body.style.cursor = 'auto';
                if (this.swipeUp) {
                    const content = document.querySelector('#main-content');
                    const height = window.innerHeight - 150;
                    content.style.height = `${height}px`;
                } else {
                    const regionsHeader = document.querySelector('#regions-header');
                    const swipeHandle = document.querySelector('#swipe-handle');
                    const content = document.querySelector('#main-content');

                    const minHeight = (swipeHandle.getBoundingClientRect().height + regionsHeader.getBoundingClientRect().height);
                    content.style.height = `${minHeight}px`;
                }
            },
            onSwipeUp() {
                const content = document.querySelector('#main-content');
                const height = window.innerHeight - 150;
                content.style.height = `${height}px`;
            },
            onSwipeDown() {
                const regionsHeader = document.querySelector('#regions-header');
                const swipeHandle = document.querySelector('#swipe-handle');
                const content = document.querySelector('#main-content');

                const minHeight = (swipeHandle.getBoundingClientRect().height + regionsHeader.getBoundingClientRect().height);
                content.style.height = `${minHeight}px`;
            },
        }
    })
})
$(function () {


    // fetch('./img/full.xml')
    //     .then(res => res.text())
    //     .then(res => {
    //         const parser = new DOMParser();
    //         const xmlDoc = parser.parseFromString(res, 'text/xml');
    //
    //         xmlDoc.querySelectorAll('relation').forEach(function (e) {
    //             const tag = e.querySelector('tag[k=name]')
    //             if (e.id == '49915') {
    //                 return;
    //             }
    //
    //             fetch(`https://www.openstreetmap.org/api/0.6/relation/${e.id}/full`)
    //                 .then(res => res.text())
    //                 .then(res => {
    //                     const parser = new DOMParser();
    //                     const xmlDoc = parser.parseFromString(res, 'text/xml');
    //                     const relation = relations.find(x => x.id == e.id)
    //                     relation.children = []
    //                     xmlDoc.querySelectorAll('relation').forEach(function (p) {
    //                         if (p.id === e.id) {
    //                             return
    //                         }
    //                         const tag = p.querySelector('tag[k=name]');
    //                         let name = tag.getAttribute('v').replace('Tỉnh', '');
    //                         name = name.replace('Thành phố', '')
    //                         name = name.trim();
    //                         relation.children.push({
    //                             id: p.id,
    //                             key: slugSearch(name),
    //                             name: name
    //                         })
    //                     })
    //                 });
    //         })
    //     });
})

