    // --- CONFIGURATION ---
        // If running in VS Code, paste your key between the quotes below.
        // If running in the Preview, the environment handles it automatically.
        const apiKey = "METToken 289e2a287ba33ab5c7f5f2eaec2bcdf0732a15ef"; 

        // --- CORE NAVIGATION ---
        function switchPage(pageId) {
            ['page-engine', 'page-met', 'page-about'].forEach(p => document.getElementById(p).classList.add('hidden'));
            ['nav-engine', 'nav-met', 'nav-about'].forEach(n => document.getElementById(n).classList.remove('active'));
            document.getElementById('page-' + pageId).classList.remove('hidden');
            document.getElementById('nav-' + pageId).classList.add('active');
            if(pageId === 'engine') drawGraphs();
        }

        // --- FUZZY LOGIC ENGINE ---
        const triangle = (x, a, b, c) => Math.max(0, Math.min((x - a) / (b - a), (c - x) / (c - b)));
        const trapL = (x, a, b) => x <= a ? 1 : (x >= b ? 0 : (b - x) / (b - a));
        const trapR = (x, a, b) => x <= a ? 0 : (x >= b ? 1 : (x - a) / (b - a));


        const SYSTEM = {
            inputs: {
                wind: { calm: x => trapL(x, 20, 40), breezy: x => triangle(x, 20, 50, 80), gale: x => trapR(x, 60, 90) },
                humidity: { dry: x => trapL(x, 30, 50), moist: x => triangle(x, 30, 60, 80), saturated: x => trapR(x, 60, 90) },
                temp: { cold: x => trapL(x, 15, 25), mild: x => triangle(x, 15, 28, 40), hot: x => trapR(x, 30, 40) }
            }
        };

        // --- API DATA FETCHING WITH EXPONENTIAL BACKOFF ---

        async function fetchMetData() {
            const btn = document.getElementById('fetch-btn');
            const spinner = document.getElementById('loading-spinner');
            const container = document.getElementById('met-forecast-container');
            const crossContainer = document.getElementById('cross-analysis');
            const sensorBox = document.getElementById('sensor-stream');
            const locSelect = document.getElementById('location-select');
            
            const locName = locSelect.options[locSelect.selectedIndex].text;
            const lockey = locSelect.value;

            btn.disabled = true;
            spinner.classList.remove('hidden');
            container.innerHTML = `<p class="animate-pulse text-sky-400">Syncing with Station ${lockey}...</p>`;

            const prompt = `Fetch current MET Malaysia data for ${locName} (Location: ${lockey}). Return JSON ONLY: { "temperature": number, "humidity": number, "wind_speed": number, "forecast_headline": "string", "station_name": "string" }.`;
            const date = new Date();

            const api_key = 'zpka_ea8961b71cd34a04996fbb0d6ce49699_06a146be';

            try {
                const response = await fetch(`https://dataservice.accuweather.com/currentconditions/v1/${lockey}?apikey=${api_key}&details=true`, {
                        headers: {
                        //     'Authorization' : ` Bearer ${api_key}`
                        }
                        });
                    /*body: JSON.stringify({
                        contents: [{ parts: [{ text: userQuery }] }],
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        generationConfig: { responseMimeType: "application/json" },
                        tools: [{ "google_search": {} }]
                    })
                });*/

                
                if (!response.ok) throw new Error("API Bridge Failure");
                if (!response.ok) throw new console.log("API Fetch Error");
                
                
                console.log(response);
                var data = await response.json();

                var windspeed = data[0].Wind.Speed.Metric.Value;
                var airhumid = data[0].RelativeHumidity;
                var airtemp = data[0].Temperature.Metric.Value;

                // UI Updates
                //container.innerHTML = `<div class="p-3 bg-slate-900 border border-slate-700 rounded"><span class="text-sky-400 block text-[10px] mb-1">DATA SOURCE: ${data.locationname}</span><span class="text-white text-base font-bold">${data.forecast_headline}</span></div>`;
                sensorBox.classList.remove('opacity-30', 'grayscale');
                document.getElementById('live-wind-val').textContent = `${data[0].Wind.Speed.Metric.Value} km/h`;
                document.getElementById('live-wind-bar').style.width = `${Math.min(data[0].Wind.Speed.Metric.Value, 100)}%`;

                document.getElementById('live-hum-val').textContent = `${data[0].RelativeHumidity}%`;
                document.getElementById('live-hum-bar').style.width = `${data[0].RelativeHumidity}%`;

                document.getElementById('live-temp-val').textContent = `${data[0].Temperature.Metric.Value}°C`;
                document.getElementById('live-temp-bar').style.width = `${(data[0].Temperature.Metric.Value/50)*100}%`;

                //Testing 2
/*
                document.getElementById('val-wind').textContent = `${data[0].Wind.Speed.Metric.Value} km/h`;
                document.getElementById('input-wind').value = `${Math.min(data[0].Wind.Speed.Metric.Value, 100)}%`;

                document.getElementById('val-hum').textContent = `${data[0].RelativeHumidity}%`;
                document.getElementById('input-hum').style.width = `${data[0].RelativeHumidity}%`;

                document.getElementById('val-temp').textContent = `${data[0].Temperature.Metric.Value}°C`;
                document.getElementById('input-temp').style.width = `${(data[0].Temperature.Metric.Value/50)*100}%`; 
*/
                // TESTING


                //TESTING END

                document.getElementById('last-sync').textContent = new Date().toLocaleTimeString();
                document.getElementById('api-status-badge').textContent = "CONNECTED";
                document.getElementById('api-status-badge').className = "text-emerald-400";

                var res = calculateDangerPercentage(airhumid, airtemp, windspeed);

                var respercent = res.percentage;
                var resstatus = res.status;
                const color = res.percentage >= 70 ? 'status-critical' : (res.percentage >= 35 ? 'status-caution' : 'status-safe');

                document.getElementById('output-text').textContent = resstatus;
                document.getElementById('output-percent').textContent = respercent;
                
                crossContainer.innerHTML = `<div class="text-center animate-fadeIn"><div class="text-[10px] text-slate-500 mb-1 uppercase tracking-widest">SkySentinel AI Check</div><div class="text-3xl font-bold ${color} mb-1">${resstatus}</div><div class="text-4xl text-white font-mono">${respercent}%</div></div>`;
                
                


            } catch (error) {
                container.innerHTML = `<p class="text-red-400">Sync Error: ${error.message}</p>`;
                document.getElementById('api-status-badge').textContent = "LOCKED/ERROR";
                document.getElementById('api-status-badge').className = "text-red-400";
            } finally {
                btn.disabled = false;
                spinner.classList.add('hidden');

                
            const sliders = {
                wind: document.getElementById('input-wind'),
                hum: document.getElementById('input-hum'),
                temp: document.getElementById('input-temp'),

                windLabel: document.getElementById('val-wind'),
                humLabel: document.getElementById('val-hum'),
                tempLabel: document.getElementById('val-temp')
            };

            // Clamp helper
            const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

            // Sync labels + fuzzy engine
            function syncSliders() {
                const w = parseInt(sliders.wind.value);
                const h = parseInt(sliders.hum.value);
                const t = parseInt(sliders.temp.value);

                sliders.windLabel.textContent = `${w} km/h`;
                sliders.humLabel.textContent = `${h} %`;
                sliders.tempLabel.textContent = `${t} °C`;

                // Call your existing logic
                drawGraphs(w, h, t);
            }

            // Programmatic control (API / AI / presets)
            function setSliderValues({ wind, humidity, temperature }) {
                sliders.wind.value = clamp(wind, 0, 100);
                sliders.hum.value = clamp(humidity, 0, 100);
                sliders.temp.value = clamp(temperature, 0, 50);

                syncSliders();
            }

            // Manual control (user dragging)
            

            //Input weather data
            setSliderValues({
                wind: data[0].Wind.Speed.Metric.Value,
                humidity: data[0].RelativeHumidity,
                temperature: data[0].Temperature.Metric.Value
            });
            }
        }

        // --- DASHBOARD UI & RENDER ---
        const ui = {
            wInput: document.getElementById('input-wind'), hInput: document.getElementById('input-hum'), tInput: document.getElementById('input-temp'),
            wVal: document.getElementById('val-wind'), hVal: document.getElementById('val-hum'), tVal: document.getElementById('val-temp'),
            outText: document.getElementById('output-text'), outPercent: document.getElementById('output-percent'), ruleList: document.getElementById('rule-list')
        };

        function updateManual() {
            const w = parseInt(ui.wInput.value); const h = parseInt(ui.hInput.value); const t = parseInt(ui.tInput.value);
            drawGraphs(w, h, t);
        }


        function drawGraphs(w = 10, h = 40, t = 25) {
            const draw = (id, mf, color, val) => {
                const ctx = document.getElementById(id).getContext('2d');
                const { width, height } = ctx.canvas;
                ctx.clearRect(0,0,width,height);
                ctx.strokeStyle = color; ctx.beginPath();
                for(let x=0; x<=100; x++) {
                    const y = mf(x) * (height - 10);
                    if(x===0) ctx.moveTo(0, height-y); else ctx.lineTo((x/100)*width, height-y);
                }
                ctx.stroke();
                ctx.fillStyle = "#fff"; ctx.fillRect((val / 100) * width, 0, 2, height);
            };
            draw('canvas-wind', SYSTEM.inputs.wind.breezy, '#0ea5e9', w);
            draw('canvas-hum', SYSTEM.inputs.humidity.moist, '#3b82f6', h);
            draw('canvas-temp', SYSTEM.inputs.temp.mild, '#f59e0b', (t/50)*100);
        }

        //fuzzy calculation starts

        function getHumidityLevel(h) {
                if (h <= 40) return "Low";
                if (h <= 70) return "Medium";
                return "High";
            }

        function getTemperatureLevel(t) {
                if (t <= 22) return "Low";
                if (t <= 32) return "Medium";
                return "High";
            }

        function getWindLevel(w) {
                if (w <= 10) return "Low";
                if (w <= 25) return "Medium";
                return "High";
            }

        function ruleBasedScore(H, T, W) {

                if (H==="Low" && T==="Low" && W==="Low") return 5;
                if (H==="Low" && T==="Low" && W==="Medium") return 10;
                if (H==="Low" && T==="Low" && W==="High") return 20;

                if (H==="Medium" && T==="Low" && W==="Low") return 10;
                if (H==="Medium" && T==="Low" && W==="Medium") return 20;
                if (H==="Medium" && T==="Low" && W==="High") return 30;

                if (H==="High" && T==="Low" && W==="Low") return 25;
                if (H==="High" && T==="Low" && W==="Medium") return 35;
                if (H==="High" && T==="Low" && W==="High") return 45;

                // 🟡 MEDIUM TEMP
                if (H==="Low" && T==="Medium" && W==="Low") return 20;
                if (H==="Low" && T==="Medium" && W==="Medium") return 30;
                if (H==="Low" && T==="Medium" && W==="High") return 40;

                if (H==="Medium" && T==="Medium" && W==="Low") return 35;
                if (H==="Medium" && T==="Medium" && W==="Medium") return 50;
                if (H==="Medium" && T==="Medium" && W==="High") return 65;

                if (H==="High" && T==="Medium" && W==="Low") return 55;
                if (H==="High" && T==="Medium" && W==="Medium") return 70;
                if (H==="High" && T==="Medium" && W==="High") return 80;

                // 🔴 HIGH TEMP
                if (H==="Low" && T==="High" && W==="Low") return 45;
                if (H==="Low" && T==="High" && W==="Medium") return 60;
                if (H==="Low" && T==="High" && W==="High") return 75;

                if (H==="Medium" && T==="High" && W==="Low") return 65;
                if (H==="Medium" && T==="High" && W==="Medium") return 80;
                if (H==="Medium" && T==="High" && W==="High") return 90;

                if (H==="High" && T==="High" && W==="Low") return 85;
                if (H==="High" && T==="High" && W==="Medium") return 95;
                if (H==="High" && T==="High" && W==="High") return 100;

                return 0;
            }

        function calculateDangerPercentage(humidity, temperature, wind) {

            const H = getHumidityLevel(humidity);
            const T = getTemperatureLevel(temperature);
            const W = getWindLevel(wind);

            const percentage = ruleBasedScore(H, T, W);

            let status;
            if (percentage < 35) { status = "Stable"; ui.outText.className = "text-3xl font-bold tech-font status-safe mb-1";}
            else if (percentage < 70) { status = "Caution"; ui.outText.className = "text-3xl font-bold tech-font status-caution mb-1"; }
            else { status = "Dangerous"; ui.outText.className = "text-3xl font-bold tech-font status-critical warning-pulse mb-1"; }

            return { percentage, status };
        }

        //fuzzy calculation ends

        //fuzzy graphs starts

        window.onload = () => {
            ui.wInput.oninput = updateManual; ui.hInput.oninput = updateManual; ui.tInput.oninput = updateManual;
            updateManual();
            setInterval(() => { document.getElementById('footer-time').textContent = new Date().toLocaleTimeString('en-MY', {timeZone: 'Asia/Kuala_Lumpur'}) + " UTC+8"; }, 1000);
        };