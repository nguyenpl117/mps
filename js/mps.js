( () => {
        jQuery(document).ready(function(e) {
            let U = "pk.eyJ1IjoibWluaHRhbjg4bSIsImEiOiJjbHBzNzI3OGMwMHR5Mmpyenh2emdjd3RwIn0.XtY7F_YpVsHqXQzIylqsiw"
                , _ = e("#osm-wrapper")
                , J = _.data("osm")
                , z = _.data("regions")
                , i = L.map("osm-wrapper")
                , E = e("#loading-indicator")[0]
                , r = e("#industry-detail")
                , b = e("#industries")
                , N = e("#province-info-full")
                , C = e("#register-form")
                , A = ["#8b5cf6", "#eab308", "#0ea5e9", "#10b981", "#06b6d4", "#84cc16", "#22c55e", "#14b8a6", "#f59e0b", "#f43f5e", "#a855f7", "#d946ef", "#ef4444", "#f97316", "#ec4899", "#6366f1", "#3b82f6"]
                , R = []
                , $ = `${window.location.origin}/wp-content/themes/mps/img/pin.png`
                , V = L.icon({
                iconUrl: $,
                iconSize: [30, 38],
                iconAnchor: [10, 19],
                className: "iphub-marker iphub-marker-1"
            })
                , tt = `${window.location.origin}/wp-content/themes/mps/img/pin-2.png`
                , et = L.icon({
                iconUrl: tt,
                iconSize: [30, 38],
                iconAnchor: [10, 19],
                className: "iphub-marker iphub-marker-2"
            });
            var y = !1, l, c, S = document.getElementById("navigation-message"), k;
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            }).addTo(i);
            var ut = L.control.locate({
                flyTo: !0,
                drawCircle: !1,
                showPopup: !1,
                initialZoomLevel: 13
            }).addTo(i)
                , x = null;
            i.on("locationfound", function(t) {
                x ? x.setLatLng(t.latlng) : x = L.marker(t.latlng).addTo(i),
                    x.bindTooltip("You are here", {
                        permanent: !1,
                        direction: "top",
                        offset: L.point(-16, -16)
                    }),
                    x.on("click", function() {
                        x.bounce({
                            duration: 500,
                            height: 100
                        }),
                        y && (c && (B(),
                            l = null,
                            c = null),
                            l ? (c = x.getLatLng(),
                                e("#end-point").val(`${c.lat}, ${c.lng}`),
                                j(l, c)) : (l = x.getLatLng(),
                                e("#start-point").val(`${l.lat}, ${l.lng}`),
                                S.classList.add("hidden")))
                    })
            });
            var Y = L.control({
                position: "topright"
            });
            Y.onAdd = function(t) {
                var n = L.DomUtil.create("div", "activate-navigation-control");
                return n.innerHTML = `<button id="activate-navigation-btn">${mpsString.active_map_nav_btn_text}</button>`,
                    L.DomEvent.on(n, "click", function(o) {
                        L.DomEvent.stopPropagation(o),
                            y = !y,
                            n.innerHTML = '<button id="activate-navigation-btn">' + (y ? mpsString.deactive_map_nav_btn_text : mpsString.active_map_nav_btn_text) + "</button>",
                            y ? (document.getElementById("maps-wrapper").classList.add("!w-full", "active-navi"),
                                document.getElementById("instructions-panel").classList.remove("!hidden"),
                                _.find(".leaflet-control-zoom").addClass("!block"),
                                e(".child-maps .back-btn").hide(),
                                e("#start-point").val(""),
                                e("#end-point").val(""),
                                S.innerHTML = "Click the map to add start waypoints",
                                S.classList.remove("hidden"),
                                setTimeout(function() {
                                    t.invalidateSize()
                                }, 400)) : (nt(),
                                e(".child-maps .back-btn").show(),
                                _.find(".leaflet-control-zoom").removeClass("!block"))
                    }),
                    n
            }
                ,
                Y.addTo(i);
            function nt() {
                l = null,
                    c = null,
                    y = !1,
                    e("#start-point").val(""),
                    e("#end-point").val(""),
                    document.getElementById("instructions-panel").classList.add("!hidden"),
                    e("#activate-navigation-btn").text(mpsString.active_map_nav_btn_text),
                    document.getElementById("maps-wrapper").classList.remove("!w-full", "active-navi"),
                    S.classList.add("hidden"),
                    setTimeout(function() {
                        i.invalidateSize()
                    }, 400),
                k && i.removeLayer(k),
                    D(),
                    B(),
                    console.log("Navigation mode reset and panel cleared")
            }
            var I, M;
            i.on("click", function(t) {
                if (y)
                    if (c && (B(),
                        l = null,
                        c = null),
                        l) {
                        c = t.latlng,
                            M = L.marker(c).addTo(i),
                            M.bounce({
                                duration: 500,
                                height: 100
                            });
                        var a = c.lat.toString().slice(0, 8)
                            , s = c.lng.toString().slice(0, 8);
                        e("#end-point").val(`${a}, ${s}`),
                            j(l, c)
                    } else {
                        l = t.latlng,
                            I = L.marker(l).addTo(i),
                            I.bounce({
                                duration: 500,
                                height: 100
                            });
                        var n = l.lat.toString().slice(0, 8)
                            , o = l.lng.toString().slice(0, 8);
                        e("#start-point").val(`${n}, ${o}`),
                            S.classList.add("hidden")
                    }
            });
            var q = L.control({
                position: "topright"
            });
            q.onAdd = function(t) {
                var n = L.DomUtil.create("div", "reset-map-control");
                return n.innerHTML = `<button id="reset-map">${mpsString.view_all_ip_btn_text}</button>`,
                    L.DomEvent.on(n, "click", function(o) {
                        L.DomEvent.stopPropagation(o),
                            D()
                    }),
                    n
            }
                ,
                q.addTo(i);
            let Q, v, G = L.latLngBounds([]);
            async function X(t) {
                W(!0);
                try {
                    let o = await (await fetch(t)).json();
                    console.log(o),
                        o.forEach(a => {
                                let {acf: s} = a;
                                s && s.industry_lat && s.industry_long && ot(a)
                            }
                        )
                } catch (n) {
                    console.log(n)
                } finally {
                    J ? e.getJSON(`/wp-content/themes/mps/osm/${J}.txt`, function(n) {
                        v = L.geoJSON(n, {
                            style: {
                                color: "#dc2626",
                                weight: 2,
                                fillOpacity: .1
                            }
                        }).addTo(i),
                            i.fitBounds(v.getBounds())
                    }) : i.fitBounds(G, {
                        maxZoom: 14
                    }),
                    e("body").hasClass("page-template-page-collection") && it(),
                        W(!1)
                }
            }
            function ot(t) {
                let n = parseFloat(t.acf.industry_lat), o = parseFloat(t.acf.industry_long), a;
                t.acf.is_cluster ? a = L.marker([n, o], {
                    icon: et,
                    riseOnHover: !0,
                    alt: t.id
                }) : a = L.marker([n, o], {
                    icon: V,
                    riseOnHover: !0,
                    alt: t.id
                });
                let s = t.title.rendered
                    , d = parseFloat(t.acf.industry_area)
                    , f = parseFloat(t.acf.industry_year)
                    , u = new Date().getFullYear()
                    , m = f - u
                    , p = `<div class="popup_content">
                <h4 class="name">${s}</h4>`;
                d && (p += `<div class="area"><span>${mpsString.area_text}:</span><span>${d} ${mpsString.area_unit_text}</span></div>`),
                m && (p += `<div class="exp"><span>${mpsString.exp_text}:</span><span>${m} ${mpsString.exp_unit_text}</span></div>`),
                    p += "</div>",
                    a.addTo(i),
                    G.extend([n, o]),
                    a.bindTooltip(t.title.rendered, {
                        permanent: !1,
                        direction: "top",
                        offset: L.point(0, -50)
                    }),
                    a.bindPopup(p, {
                        offset: [0, -45],
                        autoClose: !1
                    }),
                    R.push(a),
                    a.on("click", function() {
                        if (a.bounce({
                            duration: 500,
                            height: 100
                        }),
                            y) {
                            c && (B(),
                                l = null,
                                c = null);
                            var g = a.getLatLng(), h = a.getTooltip(), w;
                            if (h && h.getContent()) {
                                var O = document.createElement("textarea");
                                O.innerHTML = h.getContent(),
                                    w = O.value
                            } else
                                w = `${g.lat.toString().slice(0, 5)}, ${g.lng.toString().slice(0, 5)}`;
                            l ? (c = g,
                                e("#end-point").val(w),
                                e("#end-point").attr("title", w),
                                j(l, c)) : (l = g,
                                e("#start-point").val(w),
                                e("#start-point").attr("title", w),
                                S.classList.add("hidden"))
                        }
                    })
            }
            function it() {
                for (let t of R)
                    t.openPopup()
            }
            function Z(t) {
                t && (typeof t == "string" ? t.includes(",") ? (t = t.split(","),
                    t.forEach( (n, o) => {
                            e.getJSON(`/wp-content/themes/mps/osm/${n}.txt`, function(a) {
                                v = L.geoJSON(a, {
                                    style: {
                                        color: A[o],
                                        weight: 2,
                                        fillOpacity: .3
                                    }
                                }).addTo(i)
                            })
                        }
                    )) : e.getJSON(`/wp-content/themes/mps/osm/${t}.txt`, function(n) {
                    v = L.geoJSON(n, {
                        style: {
                            color: A[0],
                            weight: 2,
                            fillOpacity: .3
                        }
                    }).addTo(i)
                }) : typeof t == "number" && e.getJSON(`/wp-content/themes/mps/osm/${t}.txt`, function(n) {
                    v = L.geoJSON(n, {
                        style: {
                            color: A[0],
                            weight: 2,
                            fillOpacity: .3
                        }
                    }).addTo(i)
                }))
            }
            function B() {
                k && i.removeLayer(k),
                I && (i.removeLayer(I),
                    I = null),
                M && (i.removeLayer(M),
                    M = null)
            }
            async function j(t, n) {
                var o = `https://api.mapbox.com/directions/v5/mapbox/driving/${t.lng},${t.lat};${n.lng},${n.lat}?alternatives=true&geometries=geojson&steps=true&overview=full&language=vi&access_token=${U}`
                    , a = await fetch(o)
                    , s = await a.json()
                    , d = s.routes[0].geometry;
                k = L.geoJSON(d, {
                    style: {
                        color: "#0019ff",
                        weight: 8,
                        opacity: .75
                    }
                }).addTo(i),
                    k.on("add", function() {
                        i.fitBounds(k.getBounds(), {
                            padding: [30, 30]
                        })
                    }),
                    i.fitBounds(k.getBounds());
                var f = (s.routes[0].distance / 1e3).toFixed(2)
                    , u = s.routes[0].duration
                    , m = Math.floor(u / 3600);
                u %= 3600;
                var p = Math.floor(u / 60)
                    , g = `${m > 0 ? m + " hour" + (m > 1 ? "s" : "") + ", " : ""}${p} minutes`
                    , h = `
        <div class="route-header grid grid-cols-[30px_auto] items-center gap-2 mt-4 mb-2 text-sm p-4 rounded bg-gray-800">
            <div class="icon"></div>
            <div>
            <p>${g}</p>
            <p>${f} km</p>
            </div>
        </div>
        <div class="route-step h-max text-sm p-4 rounded bg-gray-800 cursor-pointer hover:bg-gray-700">
        <h4 class="text-sm">Click to view steps</h4>
        <ol class="list-decimal step-list">`;
                s.routes[0].legs[0].steps.forEach(function(w) {
                    h += `<li>${w.maneuver.instruction}</li>`
                }),
                    h += "</ol></div>",
                    document.getElementById("instructions").innerHTML = h
            }
            function W(t) {
                E.style.display = t ? "flex" : "none"
            }
            function at(t, n) {
                let o = i._layers;
                for (let a in o) {
                    let s = o[a];
                    if (s instanceof L.Marker && s.getLatLng().equals(L.latLng(t, n)))
                        return s
                }
                return null
            }
            async function K(t) {
                E.style.display = "flex";
                var n = lt("user_collection");
                v && v.setStyle({
                    fillOpacity: 0
                });
                let o = `${window.location.origin}/wp-json/wp/v2/industry/${t}`;
                try {
                    let d = await (await fetch(o)).json()
                        , f = d.id
                        , u = parseFloat(d.acf.industry_lat)
                        , m = parseFloat(d.acf.industry_long)
                        , p = d.title.rendered
                        , g = d.content.rendered
                        , h = d.acf.industry_youtube
                        , w = d.featured_image_url
                        , O = e("body").data("search-str")
                        , P = e("<div>").html(g);
                    P.find("table").each(function() {
                        e(this).wrap('<div class="table-responsive overflow-x-auto max-w-full"></div>')
                    }),
                        P.find("table, table th, table td, table tr, table thead, table tbody").removeAttr("style").removeClass();
                    let H = P.html();
                    if (O) {
                        let T = ft(O)
                            , dt = new RegExp(T,"gi");
                        H = H.replace(dt, function(pt) {
                            return `<mark class="highlight">${pt}</mark>`
                        })
                    }
                    let F = document.createElement("img");
                    F.src = w,
                        F.className = "w-full h-auto aspect-square object-cover object-center rounded",
                        r.find("#thumbnail").html(F),
                        r.find("#industry-name").html(p),
                        r.find("#industry-content").html(H),
                        r.find(".view-gallery").attr("data-id", f),
                        r.find(".contact-ip").data("name", p),
                        r.find(".collection-btn").attr("data-id", f),
                        h ? r.find(".view-video").attr("href", h) : r.find(".view-video").css("display", "none"),
                        st(f);
                    let ct = d.link;
                    if (r.find(".share-this-btn").attr("data-url", ct),
                    n !== null) {
                        var a = n.split(",").map(T => T.trim());
                        a.includes(f.toString()) ? (collectBtn = r.find(".add-to-collection"),
                            collectBtn.removeClass("add-to-collection"),
                            collectBtn.addClass("remove-from-collection"),
                            r.find(".remove-from-collection").find("span").text(mpsString.remove_from_collection_text)) : (collectBtn = r.find(".remove-from-collection"),
                            collectBtn.removeClass("remove-from-collection"),
                            collectBtn.addClass("add-to-collection"),
                            r.find(".add-to-collection").find("span").text(mpsString.add_to_collection_text))
                    }
                    if (r.addClass("shown"),
                    isNaN(u) || isNaN(m))
                        return E.style.display = "none",
                            !1;
                    {
                        let T = at(u, m);
                        return v && v.setStyle({
                            fillOpacity: 0
                        }),
                        T && (i.flyTo([u, m], 14),
                            T.openPopup(),
                            e(".leaflet-marker-icon").removeClass("active"),
                            T.getElement().classList.add("active")),
                            E.style.display = "none",
                            !0
                    }
                } catch (s) {
                    return E.style.display = "none",
                        console.log(s),
                        !1
                }
            }
            function D() {
                v && v.setStyle({
                    fillOpacity: .1
                }),
                    i.eachLayer(function(t) {
                        t instanceof L.Marker && t.isPopupOpen() && t.closePopup()
                    }),
                    i.flyToBounds(Q, {
                        animate: !0,
                        duration: 1.5
                    })
            }
            function st(t) {
                r.find("#industry_gallery").hide(),
                    jQuery.ajax({
                        type: "POST",
                        url: "/wp-admin/admin-ajax.php",
                        data: {
                            action: "load_industry_gallery",
                            id: t
                        },
                        success: function(n) {
                            r.find("#industry_gallery").html(n);
                            let o = new Swiper("#industry_gallery .swiper",{
                                loop: !1,
                                slidesPerView: 3,
                                spaceBetween: 5,
                                observer: !0,
                                observeParents: !0,
                                pagination: {
                                    el: "#industry_gallery .swiper-pagination",
                                    clickable: !0
                                },
                                autoplay: {
                                    delay: 5e3
                                },
                                navigation: {
                                    nextEl: "#industry_gallery .swiper-button-next",
                                    prevEl: "#industry_gallery .swiper-button-prev"
                                },
                                on: {
                                    afterInit: function() {
                                        r.find("#industry_gallery").slideDown(),
                                            Fancybox.bind('[data-fancybox="gallery"]', {})
                                    }
                                }
                            })
                        },
                        error: function() {}
                    })
            }
            function rt() {
                let t = `${window.location.origin}/wp-json/wp/v2/mps_logistic?per_page=100`;
                e.getJSON(t, function(n) {
                    n.forEach(function(o) {
                        let a = `${window.location.origin}/wp-content/themes/mps/img/`
                            , s = a + "default_marker.png";
                        o.mps_logistic_cat.includes(110) || o.mps_logistic_cat.includes(117) ? s = a + "anchor.svg" :
                            o.mps_logistic_cat.includes(118) ? s = a + "gate.svg" : o.mps_logistic_cat.includes(119) ? s = a + "airport.svg" : o.mps_logistic_cat.includes(120) && (s = a + "iland.svg");
                        let d = L.icon({
                            iconUrl: s,
                            iconSize: [24, 24],
                            iconAnchor: [12, 24],
                            popupAnchor: [0, -24]
                        });
                        if (o.acf.lat && o.acf.long) {
                            let f = L.marker([o.acf.lat, o.acf.long], {
                                icon: d
                            }).addTo(i);
                            f.bindTooltip(o.title.rendered, {
                                permanent: !1,
                                direction: "top",
                                offset: L.point(0, -30)
                            }),
                                f.on("click", function() {
                                    if (f.bounce({
                                        duration: 500,
                                        height: 100
                                    }),
                                        y) {
                                        c && (B(),
                                            l = null,
                                            c = null);
                                        var u = f.getLatLng(), m = f.getTooltip(), p;
                                        if (m && m.getContent()) {
                                            var g = document.createElement("textarea");
                                            g.innerHTML = m.getContent(),
                                                p = g.value
                                        } else
                                            p = `${u.lat.toString().slice(0, 5)}, ${u.lng.toString().slice(0, 5)}`;
                                        l ? (c = u,
                                            e("#end-point").val(p),
                                            e("#end-point").attr("title", p),
                                            j(l, c)) : (l = u,
                                            e("#start-point").val(p),
                                            e("#start-point").attr("title", p),
                                            S.classList.add("hidden"))
                                    }
                                })
                        }
                    })
                })
            }
            if (rt(),
                e("body").hasClass("tax-industry_location")) {
                let t = _.data("location")
                    , n = `${window.location.origin}/wp-json/wp/v2/industry?industry_location=${t}&per_page=200`;
                X(n),
                    Z(z)
            }
            if (e("body").hasClass("page-template-page-collection") || e("body").hasClass("search")) {
                let t = b.data("in");
                if (t) {
                    let n = `${window.location.origin}/wp-json/wp/v2/industry/?include=${t}&per_page=200`;
                    X(n),
                        Z(z)
                }
            }
            i.whenReady( () => {
                    Q = i.getBounds(),
                        e("#osm-wrapper-wrapper").trigger("mapReady")
                }
            ),
                e("#reset-map").on("click", function(t) {
                    t.preventDefault(),
                        r.removeClass("shown"),
                        b.removeClass("industry-info-actived province-info-actived contact-ip-actived"),
                        D()
                }),
                e("#industries").on("click", ".view-location", function(t) {
                    t.preventDefault();
                    var n = e(this).data("id");
                    K(n),
                        b.addClass("industry-info-actived"),
                        window.swipe.setLevel(1)
                }),
                e("#industries").on("mouseover", ".view-location", function(t) {
                    t.preventDefault();
                    var n = e(this).data("id")
                        , o = e("#osm-wrapper").find(".leaflet-marker-icon[alt=" + n + "]");
                    e("#osm-wrapper").find(".leaflet-marker-icon").css("opacity", "0.1"),
                        o.css("opacity", 1).trigger("hover")
                }),
                e("#industries").on("mouseout", ".view-location", function(t) {
                    e("#osm-wrapper").find(".leaflet-marker-icon").css("opacity", "1")
                }),
                e("#industries .province-info").on("click", ".readmore", function(t) {
                    t.preventDefault(),
                        N.addClass("active"),
                        b.addClass("province-info-actived")
                }),
                e("#osm-wrapper").on("click", ".iphub-marker", function(t) {
                    if (t.preventDefault(),
                        !y) {
                        var n = e(this).attr("alt");
                        K(n),
                            b.addClass("industry-info-actived"),
                            window.swipe.setLevel(1)
                    }
                }),
                N.on("click", ".close", function(t) {
                    t.preventDefault(),
                        N.removeClass("active"),
                        b.removeClass("province-info-actived")
                }),
                r.on("click", ".close", function(t) {
                    t.preventDefault(),
                        r.removeClass("shown"),
                        b.removeClass("industry-info-actived"),
                        D()
                }),
                r.on("click", ".contact-btn", function(t) {
                    t.preventDefault();
                    let n = e(this).data("name");
                    n && (C.find("#field_ip_name").val(n),
                        C.find(".form-heading .ip-name").html(n),
                        C.find(".form-heading .ip-name").addClass("lg:flex")),
                        C.addClass("shown"),
                        b.addClass("contact-ip-actived")
                }),
                C.on("click", ".close", function(t) {
                    t.preventDefault(),
                        C.removeClass("shown"),
                        C.find(".form-heading .ip-name").css("display", "none"),
                        b.removeClass("contact-ip-actived")
                }),
                e(document).on("keydown", function(t) {
                    e("body").hasClass("hide-scrollbar") || (t.key === "Escape" || t.keyCode === 27) && (N.removeClass("active"),
                        r.removeClass("shown"),
                        D())
                });
            function lt(t) {
                for (var n = document.cookie.split(";"), o = 0; o < n.length; o++) {
                    var a = n[o]
                        , s = a.split("=");
                    if (t == s[0].trim())
                        return decodeURIComponent(s[1])
                }
                return null
            }
        });
        function ft(e) {
            let U = {
                a: "[a\xE0\xE1\u1EA3\xE3\u1EA1\u0103\u1EB1\u1EAF\u1EB3\u1EB5\u1EB7\xE2\u1EA7\u1EA5\u1EA9\u1EAB\u1EAD]",
                \u0103: "[\u0103\u1EB1\u1EAF\u1EB3\u1EB5\u1EB7]",
                \u00E2: "[\xE2\u1EA7\u1EA5\u1EA9\u1EAB\u1EAD]",
                e: "[e\xE8\xE9\u1EBB\u1EBD\u1EB9\xEA\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7]",
                \u00EA: "[\xEA\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7]",
                i: "[i\xEC\xED\u1EC9\u0129\u1ECB]",
                o: "[o\xF2\xF3\u1ECF\xF5\u1ECD\xF4\u1ED3\u1ED1\u1ED5\u1ED7\u1ED9\u01A1\u1EDD\u1EDB\u1EDF\u1EE1\u1EE3]",
                \u00F4: "[\xF4\u1ED3\u1ED1\u1ED5\u1ED7\u1ED9]",
                \u01A1: "[\u01A1\u1EDD\u1EDB\u1EDF\u1EE1\u1EE3]",
                u: "[u\xF9\xFA\u1EE7\u0169\u1EE5\u01B0\u1EEB\u1EE9\u1EED\u1EEF\u1EF1]",
                \u01B0: "[\u01B0\u1EEB\u1EE9\u1EED\u1EEF\u1EF1]",
                y: "[y\u1EF3\xFD\u1EF7\u1EF9\u1EF5]",
                d: "[d\u0111]",
                \u0111: "[\u0111]",
                A: "[A\xC0\xC1\u1EA2\xC3\u1EA0\u0102\u1EB0\u1EAE\u1EB2\u1EB4\u1EB6\xC2\u1EA6\u1EA4\u1EA8\u1EAA\u1EAC]",
                \u0102: "[\u0102\u1EB0\u1EAE\u1EB2\u1EB4\u1EB6]",
                \u00C2: "[\xC2\u1EA6\u1EA4\u1EA8\u1EAA\u1EAC]",
                E: "[E\xC8\xC9\u1EBA\u1EBC\u1EB8\xCA\u1EC0\u1EBE\u1EC2\u1EC4\u1EC6]",
                \u00CA: "[\xCA\u1EC0\u1EBE\u1EC2\u1EC4\u1EC6]",
                I: "[I\xCC\xCD\u1EC8\u0128\u1ECA]",
                O: "[O\xD2\xD3\u1ECE\xD5\u1ECC\xD4\u1ED2\u1ED0\u1ED4\u1ED6\u1ED8\u01A0\u1EDC\u1EDA\u1EDE\u1EE0\u1EE2]",
                \u00D4: "[\xD4\u1ED2\u1ED0\u1ED4\u1ED6\u1ED8]",
                \u01A0: "[\u01A0\u1EDC\u1EDA\u1EDE\u1EE0\u1EE2]",
                U: "[U\xD9\xDA\u1EE6\u0168\u1EE4\u01AF\u1EEA\u1EE8\u1EEC\u1EEE\u1EF0]",
                \u01AF: "[\u01AF\u1EEA\u1EE8\u1EEC\u1EEE\u1EF0]",
                Y: "[Y\u1EF2\xDD\u1EF6\u1EF8\u1EF4]",
                D: "[D\u0110]",
                \u0110: "[\u0110]",
                " ": "[ ]"
            };
            return e.split("").map(_ => U[_] || _).join("")
        }
    }
)();
