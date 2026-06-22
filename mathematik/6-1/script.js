// JavaScript for Mathe-Fuchs 6
// Swiss German spelling used: "ss" instead of "ß", "Grösse", "Massstab", "Zahlenstrahl", "Schliessen" etc.

document.addEventListener("DOMContentLoaded", () => {
    
    // --- APP STATE ---
    const state = {
        theme: localStorage.getItem("theme") || "light",
        points: parseInt(localStorage.getItem("points")) || 0,
        completedQuizzes: JSON.parse(localStorage.getItem("completedQuizzes")) || { q61: false, q62: false, q63: false },
        visitedTabs: JSON.parse(localStorage.getItem("visitedTabs")) || { dashboard: true },
        // Widget states
        fraction: { numerator: 3, denominator: 4 },
        coordinatePoints: [],
        angle: 45,
        scale: 25000,
        swTokens: { H: 0, Z: 0, E: 0, z: 0, h: 0, t: 0 },
        zahlenstrahlVal: 1,
        zahlenstrahlDec: 1.3
    };

    // --- DOM ELEMENT REFERENCES ---
    const body = document.body;
    const themeSelect = document.getElementById("theme-select");
    const globalScoreSpan = document.getElementById("global-score");
    const totalProgressBar = document.getElementById("total-progress-bar");
    const totalProgressText = document.getElementById("total-progress-text");
    
    // --- INITIALIZE THE APP ---
    initTheme();
    updateGlobalScore();
    updateTotalProgress();
    setupNavigation();
    setupThemeSelector();
    
    // Initialize widgets
    initFractionModel();
    initPrimesSieve();
    initGgtKgvCalculator();
    initCoordinateSystem();
    initAngleSimulator();
    initScaleCalculator();
    initZahlenstrahl();
    initStellenwerttafel();
    
    // Initialize quizzes
    initQuiz61();
    initQuiz62();
    initQuiz63();

    // --- THEME MANAGEMENT ---
    function initTheme() {
        body.className = `theme-${state.theme}`;
        themeSelect.value = state.theme;
    }

    function setupThemeSelector() {
        themeSelect.addEventListener("change", (e) => {
            state.theme = e.target.value;
            localStorage.setItem("theme", state.theme);
            body.className = `theme-${state.theme}`;
        });
    }

    // --- NAVIGATION MANAGER (SPA) ---
    function setupNavigation() {
        const navItems = document.querySelectorAll(".nav-item");
        const tabContents = document.querySelectorAll(".tab-content");
        const topicCards = document.querySelectorAll(".topic-card");

        function switchTab(tabId) {
            navItems.forEach(item => {
                if (item.getAttribute("data-tab") === tabId) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            });

            tabContents.forEach(content => {
                if (content.id === `tab-${tabId}`) {
                    content.classList.add("active");
                } else {
                    content.classList.remove("active");
                }
            });

            // Track page visits for progress
            state.visitedTabs[tabId] = true;
            localStorage.setItem("visitedTabs", JSON.stringify(state.visitedTabs));
            updateTotalProgress();

            // Special redraws on tab change if needed
            if (tabId === "theme-61") {
                drawFractionModels();
            } else if (tabId === "theme-62") {
                drawCoordinateGrid();
                drawAngle();
            } else if (tabId === "theme-63") {
                drawZahlenstrahl();
            }
        }

        navItems.forEach(item => {
            item.addEventListener("click", () => {
                const tabId = item.getAttribute("data-tab");
                switchTab(tabId);
            });
        });

        topicCards.forEach(card => {
            card.addEventListener("click", () => {
                const tabId = card.getAttribute("data-target");
                switchTab(tabId);
            });
        });

        // Subtabs routing
        const subTabButtons = document.querySelectorAll(".sub-tab-item");
        subTabButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const parentSection = btn.closest(".tab-content");
                const targetSubTabId = btn.getAttribute("data-subtab");

                parentSection.querySelectorAll(".sub-tab-item").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                parentSection.querySelectorAll(".subtab-content").forEach(c => c.classList.remove("active"));
                const targetContent = document.getElementById(`subtab-${targetSubTabId}`);
                if (targetContent) {
                    targetContent.classList.add("active");
                }

                // Redraw canvases inside subtabs when they become active
                setTimeout(() => {
                    if (targetSubTabId === "61-fraction-model") drawFractionModels();
                    if (targetSubTabId === "62-coordinates") drawCoordinateGrid();
                    if (targetSubTabId === "62-angles") drawAngle();
                    if (targetSubTabId === "63-zahlenstrahl") drawZahlenstrahl();
                }, 50);
            });
        });
    }

    // --- SCORE & PROGRESS CALCULATION ---
    function updateGlobalScore() {
        globalScoreSpan.textContent = state.points;
        localStorage.setItem("points", state.points);
    }

    function addPoints(amount) {
        state.points += amount;
        updateGlobalScore();
    }

    function updateTotalProgress() {
        // We have 3 main topic tabs, 11 subtabs total, 3 quizzes.
        // Let's count progress based on quizzes completed and tabs visited.
        const totalItems = 6; // 3 quizzes + 3 main tabs visited
        let completedItems = 0;

        if (state.completedQuizzes.q61) completedItems++;
        if (state.completedQuizzes.q62) completedItems++;
        if (state.completedQuizzes.q63) completedItems++;

        if (state.visitedTabs["theme-61"]) completedItems++;
        if (state.visitedTabs["theme-62"]) completedItems++;
        if (state.visitedTabs["theme-63"]) completedItems++;

        const percentage = Math.round((completedItems / totalItems) * 100);
        totalProgressBar.style.width = `${percentage}%`;
        totalProgressText.textContent = `${percentage}% abgeschlossen`;

        // Update dashboard badges
        document.getElementById("progress-badge-61").textContent = state.completedQuizzes.q61 ? "Erledigt 🏆" : (state.visitedTabs["theme-61"] ? "In Arbeit 📝" : "Offen ⭕");
        document.getElementById("progress-badge-62").textContent = state.completedQuizzes.q62 ? "Erledigt 🏆" : (state.visitedTabs["theme-62"] ? "In Arbeit 📝" : "Offen ⭕");
        document.getElementById("progress-badge-63").textContent = state.completedQuizzes.q63 ? "Erledigt 🏆" : (state.visitedTabs["theme-63"] ? "In Arbeit 📝" : "Offen ⭕");
    }

    // --- WIDGET 6.1: FRACTION MODEL ---
    function initFractionModel() {
        const sliderNum = document.getElementById("frac-numerator");
        const sliderDen = document.getElementById("frac-denominator");
        const valNum = document.getElementById("val-numerator");
        const valDen = document.getElementById("val-denominator");
        const dispNum = document.getElementById("disp-num");
        const dispDen = document.getElementById("disp-den");
        const dispDecimal = document.getElementById("disp-decimal");
        const equivList = document.getElementById("equivalent-fractions-list");

        function updateFractions() {
            state.fraction.numerator = parseInt(sliderNum.value);
            state.fraction.denominator = parseInt(sliderDen.value);
            
            // Limit numerator to be <= denominator for school models, or allow improper fractions?
            // Usually in 6th grade basic models we limit numerator <= denominator. Let's enforce that:
            if (state.fraction.numerator > state.fraction.denominator) {
                sliderNum.value = sliderDen.value;
                state.fraction.numerator = state.fraction.denominator;
            }
            sliderNum.max = sliderDen.value;

            valNum.textContent = state.fraction.numerator;
            valDen.textContent = state.fraction.denominator;
            dispNum.textContent = state.fraction.numerator;
            dispDen.textContent = state.fraction.denominator;

            const decVal = (state.fraction.numerator / state.fraction.denominator).toFixed(3);
            dispDecimal.textContent = parseFloat(decVal); // removes trailing zeros

            // Calculate equivalent fractions
            const equiv = [];
            for (let i = 2; i <= 4; i++) {
                equiv.push(`${state.fraction.numerator * i}/${state.fraction.denominator * i}`);
            }
            equivList.textContent = equiv.join(", ");

            drawFractionModels();
        }

        sliderNum.addEventListener("input", updateFractions);
        sliderDen.addEventListener("input", updateFractions);
    }

    // Function to draw circle, rectangle, and line models
    function drawFractionModels() {
        const num = state.fraction.numerator;
        const den = state.fraction.denominator;

        // Colors
        const fillColor = "#e11d48"; // Crimson Red for 6.1
        const strokeColor = getComputedStyle(document.body).getPropertyValue("--border-color").trim() || "#cbd5e1";
        const emptyColor = getComputedStyle(document.body).getPropertyValue("--bg-app").trim() || "#f1f5f9";

        // 1. Circle Model
        const canvasCircle = document.getElementById("canvas-circle");
        if (canvasCircle) {
            const ctx = canvasCircle.getContext("2d");
            ctx.clearRect(0, 0, canvasCircle.width, canvasCircle.height);
            const cx = canvasCircle.width / 2;
            const cy = canvasCircle.height / 2;
            const radius = 90;

            // Draw sectors
            const angleStep = (2 * Math.PI) / den;
            for (let i = 0; i < den; i++) {
                const startAngle = i * angleStep - Math.PI / 2;
                const endAngle = (i + 1) * angleStep - Math.PI / 2;

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, radius, startAngle, endAngle);
                ctx.closePath();

                ctx.fillStyle = i < num ? fillColor : emptyColor;
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#475569";
                ctx.stroke();
            }
        }

        // 2. Rectangle Model
        const canvasRect = document.getElementById("canvas-rect");
        if (canvasRect) {
            const ctx = canvasRect.getContext("2d");
            ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);

            const width = canvasRect.width - 20;
            const height = canvasRect.height - 20;
            const x = 10;
            const y = 10;

            // Draw grid. We can divide columns.
            const colWidth = width / den;

            for (let i = 0; i < den; i++) {
                ctx.beginPath();
                ctx.rect(x + i * colWidth, y, colWidth, height);
                ctx.fillStyle = i < num ? fillColor : emptyColor;
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#475569";
                ctx.stroke();
            }
        }

        // 3. Line Model (Zahlenstrahl 0 to 1)
        const canvasLine = document.getElementById("canvas-line");
        if (canvasLine) {
            const ctx = canvasLine.getContext("2d");
            ctx.clearRect(0, 0, canvasLine.width, canvasLine.height);

            const startX = 20;
            const endX = canvasLine.width - 20;
            const length = endX - startX;
            const y = 30;

            // Draw axis line
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#475569";
            ctx.stroke();

            // Draw ticks
            const step = length / den;
            for (let i = 0; i <= den; i++) {
                const tx = startX + i * step;
                ctx.beginPath();
                ctx.moveTo(tx, y - 8);
                ctx.lineTo(tx, y + 8);
                ctx.lineWidth = i === 0 || i === den ? 3 : 2;
                ctx.strokeStyle = "#475569";
                ctx.stroke();

                // Draw tick label numbers below
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--text-main").trim();
                ctx.font = "bold 11px sans-serif";
                ctx.textAlign = "center";
                if (i === 0) ctx.fillText("0", tx, y + 22);
                else if (i === den) ctx.fillText("1", tx, y + 22);
                else ctx.fillText(`${i}/${den}`, tx, y + 22);
            }

            // Draw filled fraction bar representation above the axis line
            ctx.beginPath();
            ctx.rect(startX, y - 16, (num / den) * length, 8);
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#be123c";
            ctx.stroke();

            // Draw pointer pin at fraction value
            const px = startX + (num / den) * length;
            ctx.beginPath();
            ctx.arc(px, y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = fillColor;
            ctx.stroke();
        }
    }

    // --- WIDGET 6.1: PRIMZAHLSIEB (SIEVE OF ERATOSTHENES) ---
    function initPrimesSieve() {
        const grid = document.getElementById("primes-grid");
        if (!grid) return;

        // Populate cells
        for (let i = 1; i <= 100; i++) {
            const cell = document.createElement("div");
            cell.className = "prime-cell";
            cell.textContent = i;
            cell.id = `prime-cell-${i}`;
            if (i === 1) cell.classList.add("cell-one");
            grid.appendChild(cell);
        }

        // Setup filter handlers
        const btn2 = document.getElementById("btn-sieve-2");
        const btn3 = document.getElementById("btn-sieve-3");
        const btn5 = document.getElementById("btn-sieve-5");
        const btn7 = document.getElementById("btn-sieve-7");
        const btnReset = document.getElementById("btn-sieve-reset");

        function filterMultiples(primeNum, filterClass) {
            for (let i = 2; i <= 100; i++) {
                if (i > primeNum && i % primeNum === 0) {
                    const cell = document.getElementById(`prime-cell-${i}`);
                    if (cell && !cell.classList.contains("is-prime")) {
                        cell.className = "prime-cell " + filterClass;
                    }
                }
            }
            highlightPrimes();
        }

        function highlightPrimes() {
            // Check if all filters have been applied
            const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
            
            // Check if cells matching multiples of 2,3,5,7 have class
            let activeFilters = 0;
            if (btn2.disabled) activeFilters++;
            if (btn3.disabled) activeFilters++;
            if (btn5.disabled) activeFilters++;
            if (btn7.disabled) activeFilters++;

            // If we have filtered everything, we can highlight the actual prime cells!
            if (activeFilters >= 4) {
                primes.forEach(p => {
                    const cell = document.getElementById(`prime-cell-${p}`);
                    if (cell) cell.classList.add("is-prime");
                });
            }
        }

        btn2.addEventListener("click", () => {
            filterMultiples(2, "crossed-2");
            btn2.disabled = true;
        });

        btn3.addEventListener("click", () => {
            filterMultiples(3, "crossed-3");
            btn3.disabled = true;
        });

        btn5.addEventListener("click", () => {
            filterMultiples(5, "crossed-5");
            btn5.disabled = true;
        });

        btn7.addEventListener("click", () => {
            filterMultiples(7, "crossed-7");
            btn7.disabled = true;
        });

        btnReset.addEventListener("click", () => {
            btn2.disabled = false;
            btn3.disabled = false;
            btn5.disabled = false;
            btn7.disabled = false;

            for (let i = 1; i <= 100; i++) {
                const cell = document.getElementById(`prime-cell-${i}`);
                if (cell) {
                    cell.className = "prime-cell";
                    if (i === 1) cell.classList.add("cell-one");
                }
            }
        });
    }

    // --- WIDGET 6.1: GGT & KGV CALCULATOR ---
    function initGgtKgvCalculator() {
        const btn = document.getElementById("btn-calc-ggt-kgv");
        if (!btn) return;

        btn.addEventListener("click", () => {
            const valA = parseInt(document.getElementById("num-a").value);
            const valB = parseInt(document.getElementById("num-b").value);

            if (isNaN(valA) || isNaN(valB) || valA < 1 || valB < 1) {
                alert("Bitte gib zwei gültige Zahlen ein, die grösser als 0 sind!");
                return;
            }

            // Document labels
            document.getElementById("txt-ggt-a").textContent = valA;
            document.getElementById("txt-ggt-b").textContent = valB;
            document.getElementById("txt-kgv-a").textContent = valA;
            document.getElementById("txt-kgv-b").textContent = valB;
            document.getElementById("ans-ggt-inputs").textContent = `${valA}, ${valB}`;
            document.getElementById("ans-kgv-inputs").textContent = `${valA}, ${valB}`;

            // Calculate Teiler A & B
            const teilerA = getTeiler(valA);
            const teilerB = getTeiler(valB);
            document.getElementById("list-teiler-a").textContent = teilerA.join(", ");
            document.getElementById("list-teiler-b").textContent = teilerB.join(", ");

            // Calculate common teiler
            const commonTeiler = teilerA.filter(t => teilerB.includes(t));
            document.getElementById("list-teiler-common").textContent = commonTeiler.join(", ");

            // ggT
            const ggt = Math.max(...commonTeiler);
            document.getElementById("ans-ggt").textContent = ggt;

            // Calculate Vielfache
            const maxMultipleCount = 10;
            const vfA = [];
            const vfB = [];
            for (let i = 1; i <= maxMultipleCount; i++) {
                vfA.push(valA * i);
                vfB.push(valB * i);
            }
            document.getElementById("list-vielfache-a").textContent = vfA.join(", ") + ", ...";
            document.getElementById("list-vielfache-b").textContent = vfB.join(", ") + ", ...";

            // kgV
            const kgv = (valA * valB) / ggt;
            
            // generate matching multiples list up to kgV for demonstration
            const vfCommon = [];
            let multiplier = 1;
            while (vfCommon.length < 2) {
                vfCommon.push(kgv * multiplier);
                multiplier++;
            }
            document.getElementById("list-vielfache-common").textContent = vfCommon.join(", ") + ", ...";
            document.getElementById("ans-kgv").textContent = kgv;
        });

        function getTeiler(num) {
            const list = [];
            for (let i = 1; i <= num; i++) {
                if (num % i === 0) list.push(i);
            }
            return list;
        }
    }

    // --- WIDGET 6.2: COORDINATE SYSTEM ---
    function initCoordinateSystem() {
        const canvas = document.getElementById("canvas-coordinates");
        if (!canvas) return;

        canvas.addEventListener("click", (e) => {
            const rect = canvas.getBoundingClientRect();
            const rawX = e.clientX - rect.left;
            const rawY = e.clientY - rect.top;

            // Translate canvas pixels to math coordinates
            // Padding on canvas: 40px margins
            const padding = 40;
            const axisLength = canvas.width - padding * 2;
            const mathX = (rawX - padding) / (axisLength / 10);
            const mathY = 10 - (rawY - padding) / (axisLength / 10);

            // Snap to nearest 0.5 coordinate
            const snapX = Math.round(mathX * 2) / 2;
            const snapY = Math.round(mathY * 2) / 2;

            if (snapX >= 0 && snapX <= 10 && snapY >= 0 && snapY <= 10) {
                // Add to points
                // Check if point already exists (to delete it)
                const existingIdx = state.coordinatePoints.findIndex(p => p.x === snapX && p.y === snapY);
                if (existingIdx !== -1) {
                    state.coordinatePoints.splice(existingIdx, 1);
                } else {
                    state.coordinatePoints.push({ x: snapX, y: snapY });
                }

                updateCoordinateList();
                drawCoordinateGrid();
            }
        });

        document.getElementById("btn-clear-coords").addEventListener("click", () => {
            state.coordinatePoints = [];
            updateCoordinateList();
            drawCoordinateGrid();
        });
    }

    function updateCoordinateList() {
        const ul = document.getElementById("points-list-ul");
        ul.innerHTML = "";

        if (state.coordinatePoints.length === 0) {
            ul.innerHTML = `<li class="empty-list">Noch keine Punkte gesetzt.</li>`;
            document.getElementById("shape-properties").style.display = "none";
            return;
        }

        state.coordinatePoints.forEach((p, idx) => {
            const li = document.createElement("li");
            li.textContent = `${String.fromCharCode(65 + idx)}(${p.x.toFixed(1)} | ${p.y.toFixed(1)})`;
            ul.appendChild(li);
        });

        // Properties if polygon
        const points = state.coordinatePoints;
        if (points.length >= 3) {
            document.getElementById("shape-properties").style.display = "block";
            
            // Calculate Perimeter (Umfang)
            let perimeter = 0;
            for (let i = 0; i < points.length; i++) {
                const p1 = points[i];
                const p2 = points[(i + 1) % points.length];
                perimeter += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
            }
            document.getElementById("shape-perimeter").textContent = perimeter.toFixed(2);

            // Calculate Area (Fläche) using Shoelace Formula
            let area = 0;
            for (let i = 0; i < points.length; i++) {
                const p1 = points[i];
                const p2 = points[(i + 1) % points.length];
                area += p1.x * p2.y - p2.x * p1.y;
            }
            area = Math.abs(area) / 2;
            document.getElementById("shape-area").textContent = area.toFixed(2);
        } else {
            document.getElementById("shape-properties").style.display = "none";
        }
    }

    function drawCoordinateGrid() {
        const canvas = document.getElementById("canvas-coordinates");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 40;
        const axisLength = canvas.width - padding * 2;
        const gridSpacing = axisLength / 10;

        // Draw grid lines
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;

        // Minor grid lines at 0.5 intervals
        for (let i = 0.5; i < 10; i += 0.5) {
            const offset = padding + i * gridSpacing;
            
            // Vertical minor grid lines
            ctx.beginPath();
            ctx.moveTo(offset, padding);
            ctx.lineTo(offset, canvas.height - padding);
            ctx.setLineDash([2, 4]);
            ctx.stroke();

            // Horizontal minor grid lines
            ctx.beginPath();
            ctx.moveTo(padding, offset);
            ctx.lineTo(canvas.width - padding, offset);
            ctx.setLineDash([2, 4]);
            ctx.stroke();
        }

        ctx.setLineDash([]); // Reset line dash

        // Major grid lines at 1.0 intervals
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1.5;
        for (let i = 0; i <= 10; i++) {
            const offset = padding + i * gridSpacing;
            
            // Vertical grid lines
            ctx.beginPath();
            ctx.moveTo(offset, padding);
            ctx.lineTo(offset, canvas.height - padding);
            ctx.stroke();

            // Horizontal grid lines
            ctx.beginPath();
            ctx.moveTo(padding, offset);
            ctx.lineTo(canvas.width - padding, offset);
            ctx.stroke();
        }

        // Draw Axes (X and Y)
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2.5;

        // Y-axis (left side of grid, i.e., at padding x)
        ctx.beginPath();
        ctx.moveTo(padding, padding - 15);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.stroke();

        // X-axis (bottom side of grid, i.e., at canvas.height - padding)
        ctx.beginPath();
        ctx.moveTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding + 15, canvas.height - padding);
        ctx.stroke();

        // Draw Arrow heads
        // Y-axis arrow
        ctx.beginPath();
        ctx.moveTo(padding - 6, padding - 10);
        ctx.lineTo(padding, padding - 22);
        ctx.lineTo(padding + 6, padding - 10);
        ctx.fillStyle = "#475569";
        ctx.fill();

        // X-axis arrow
        ctx.beginPath();
        ctx.moveTo(canvas.width - padding + 10, canvas.height - padding - 6);
        ctx.lineTo(canvas.width - padding + 22, canvas.height - padding);
        ctx.lineTo(canvas.width - padding + 10, canvas.height - padding + 6);
        ctx.fillStyle = "#475569";
        ctx.fill();

        // Axis labels
        ctx.font = "bold 13px sans-serif";
        ctx.fillStyle = "#1e293b";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("x", canvas.width - padding + 25, canvas.height - padding + 15);
        ctx.fillText("y", padding - 15, padding - 20);

        // Axis Grid Numbers
        ctx.font = "11px sans-serif";
        ctx.fillStyle = "#64748b";
        for (let i = 0; i <= 10; i++) {
            const offset = padding + i * gridSpacing;
            
            // X numbers
            ctx.fillText(i.toString(), offset, canvas.height - padding + 18);

            // Y numbers
            ctx.textAlign = "right";
            ctx.fillText(i.toString(), padding - 10, canvas.height - padding - i * gridSpacing);
            ctx.textAlign = "center";
        }

        // Draw Point connections (Polygon)
        const points = state.coordinatePoints;
        if (points.length > 0) {
            ctx.beginPath();
            const firstPx = padding + points[0].x * gridSpacing;
            const firstPy = canvas.height - padding - points[0].y * gridSpacing;
            ctx.moveTo(firstPx, firstPy);

            for (let i = 1; i < points.length; i++) {
                const px = padding + points[i].x * gridSpacing;
                const py = canvas.height - padding - points[i].y * gridSpacing;
                ctx.lineTo(px, py);
            }

            if (points.length >= 3) {
                ctx.closePath();
                ctx.fillStyle = "rgba(5, 150, 105, 0.15)"; // Green transparent fill for 6.2
                ctx.fill();
            }

            ctx.strokeStyle = "#059669";
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Draw Points and labels
            points.forEach((p, idx) => {
                const px = padding + p.x * gridSpacing;
                const py = canvas.height - padding - p.y * gridSpacing;

                ctx.beginPath();
                ctx.arc(px, py, 6, 0, 2 * Math.PI);
                ctx.fillStyle = "#059669";
                ctx.fill();
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Draw label A, B, C...
                ctx.fillStyle = "#1e293b";
                ctx.font = "bold 14px sans-serif";
                ctx.fillText(String.fromCharCode(65 + idx), px + 12, py - 12);
            });
        }
    }

    // --- WIDGET 6.2: ANGLE SIMULATOR ---
    function initAngleSimulator() {
        const slider = document.getElementById("angle-slider");
        if (!slider) return;

        slider.addEventListener("input", (e) => {
            state.angle = parseInt(e.target.value);
            document.getElementById("val-angle").textContent = `${state.angle}°`;
            updateAngleType();
            drawAngle();
        });
    }

    function updateAngleType() {
        const a = state.angle;
        const typeSpan = document.getElementById("angle-type");
        const infoSpan = document.getElementById("angle-info-text");

        let type = "";
        let info = "";

        if (a === 0) {
            type = "Nullwinkel";
            info = "Keine Drehung vorhanden. Die beiden Schenkel liegen direkt aufeinander.";
        } else if (a > 0 && a < 90) {
            type = "Spitzer Winkel";
            info = "Ein spitzer Winkel ist kleiner als ein rechter Winkel (90°).";
        } else if (a === 90) {
            type = "Rechter Winkel";
            info = "Genau 90°. Das ist der Winkel, den man mit einem Geodreieck zeichnet. Die Linien stehen senkrecht.";
        } else if (a > 90 && a < 180) {
            type = "Stumpfer Winkel";
            info = "Grösser als ein rechter Winkel (90°), aber kleiner als ein gestreckter Winkel (180°).";
        } else if (a === 180) {
            type = "Gestreckter Winkel";
            info = "Genau 180°. Die beiden Schenkel bilden eine gerade Linie in entgegengesetzte Richtungen.";
        } else if (a > 180 && a < 360) {
            type = "Überstumpfer Winkel";
            info = "Der Winkel ist grösser als eine halbe Drehung (180°), aber kleiner als ein Vollkreis (360°).";
        } else if (a === 360) {
            type = "Vollwinkel";
            info = "Genau 360°. Der Schenkel hat sich einmal ganz im Kreis gedreht und liegt wieder auf dem Anfang.";
        }

        typeSpan.textContent = type;
        infoSpan.textContent = info;
    }

    // Function to draw angle sector and protractor marks
    function drawAngle() {
        const canvas = document.getElementById("canvas-angle");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = 100;

        // Draw circular background protractor scale
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.stroke();

        // Ticks on protractor every 10 degrees
        ctx.strokeStyle = "#cbd5e1";
        for (let i = 0; i < 360; i += 10) {
            const rad = (i * Math.PI) / 180;
            const startRadius = i % 90 === 0 ? radius - 12 : (i % 30 === 0 ? radius - 8 : radius - 5);
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(rad) * startRadius, cy + Math.sin(rad) * startRadius);
            ctx.lineTo(cx + Math.cos(rad) * radius, cy + Math.sin(rad) * radius);
            ctx.stroke();
        }

        // Draw Angle Fill Sector
        const angleRad = (state.angle * Math.PI) / 180;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        // We draw anticlockwise starting from 3 o'clock (0 rad).
        // Since Y-axis goes down on screen, to draw counter-clockwise we use negative angles.
        ctx.arc(cx, cy, 35, 0, -angleRad, true);
        ctx.closePath();
        ctx.fillStyle = "rgba(5, 150, 105, 0.2)"; // green tint
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#059669";
        ctx.stroke();

        // Draw Base Line (Schenkel 1) at 0° (right horizontal)
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius + 15, cy);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#475569";
        ctx.stroke();

        // Draw Rotated Line (Schenkel 2)
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(-angleRad) * (radius + 15), cy + Math.sin(-angleRad) * (radius + 15));
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#059669"; // Green line for angle
        ctx.stroke();

        // Draw Center Point vertex
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "#1e293b";
        ctx.fill();
    }

    // --- WIDGET 6.2: DISTANCE/SCALE CALCULATOR ---
    function initScaleCalculator() {
        const select = document.getElementById("scale-select");
        const mapInput = document.getElementById("scale-map-input");
        const realMInput = document.getElementById("scale-real-m");
        const realKmInput = document.getElementById("scale-real-km");

        if (!select) return;

        function updateFromMap() {
            const mapCm = parseFloat(mapInput.value);
            const scale = parseInt(select.value);
            if (isNaN(mapCm) || mapCm < 0) return;

            const realCm = mapCm * scale;
            const realM = realCm / 100;
            const realKm = realM / 1000;

            realMInput.value = realM.toFixed(1);
            realKmInput.value = realKm.toFixed(3);
        }

        function updateFromRealM() {
            const realM = parseFloat(realMInput.value);
            const scale = parseInt(select.value);
            if (isNaN(realM) || realM < 0) return;

            const realCm = realM * 100;
            const mapCm = realCm / scale;
            const realKm = realM / 1000;

            mapInput.value = mapCm.toFixed(2);
            realKmInput.value = realKm.toFixed(3);
        }

        function updateFromRealKm() {
            const realKm = parseFloat(realKmInput.value);
            const scale = parseInt(select.value);
            if (isNaN(realKm) || realKm < 0) return;

            const realM = realKm * 1000;
            const realCm = realM * 100;
            const mapCm = realCm / scale;

            mapInput.value = mapCm.toFixed(2);
            realMInput.value = realM.toFixed(1);
        }

        select.addEventListener("change", updateFromMap);
        mapInput.addEventListener("input", updateFromMap);
        realMInput.addEventListener("input", updateFromRealM);
        realKmInput.addEventListener("input", updateFromRealKm);

        // Initial compute
        updateFromMap();
    }

    // --- WIDGET 6.3: ZAHLENSTRAHL (DECIMAL ZOOM) ---
    function initZahlenstrahl() {
        const slider = document.getElementById("zahlenstrahl-slider");
        if (!slider) return;

        slider.addEventListener("input", (e) => {
            state.zahlenstrahlVal = parseInt(e.target.value);
            
            // Adjust zoom ranges
            const start = state.zahlenstrahlVal;
            const end = start + 1;
            document.getElementById("zoom-range-start").textContent = start;
            document.getElementById("zoom-range-end").textContent = end;

            // Reset selected decimal inside that range
            state.zahlenstrahlDec = start + 0.3;
            updateDecimalDisplay();
            drawZahlenstrahl();
        });

        const canvas = document.getElementById("canvas-zahlenstrahl");
        if (canvas) {
            canvas.addEventListener("click", (e) => {
                const rect = canvas.getBoundingClientRect();
                const rawX = e.clientX - rect.left;
                const rawY = e.clientY - rect.top;

                // Clicked on zoom part?
                // Zoom section is drawn in the lower half (y > 100)
                if (rawY >= 110 && rawY <= 170) {
                    const startX = 30;
                    const endX = canvas.width - 30;
                    if (rawX >= startX && rawX <= endX) {
                        const fraction = (rawX - startX) / (endX - startX);
                        // Convert fraction to tenth value:
                        const tenth = Math.round(fraction * 10);
                        
                        state.zahlenstrahlDec = state.zahlenstrahlVal + (tenth / 10);
                        updateDecimalDisplay();
                        drawZahlenstrahl();
                    }
                }
            });
        }

        // Initial setup
        updateDecimalDisplay();
    }

    function updateDecimalDisplay() {
        const val = state.zahlenstrahlDec;
        document.getElementById("strahl-dec-val").textContent = val.toFixed(1);

        // Calculate Fraction matching
        const totalTenths = Math.round(val * 10);
        let fracStr = `${totalTenths}/10`;
        
        // Mixed number representation
        const integer = Math.floor(val);
        const tenths = totalTenths - integer * 10;
        
        if (integer > 0 && tenths > 0) {
            // Simplify tenths if possible
            let simNum = tenths;
            let simDen = 10;
            if (tenths === 5) { simNum = 1; simDen = 2; }
            else if (tenths % 2 === 0) { simNum = tenths / 2; simDen = 5; }

            fracStr += ` (${integer} ${simNum}/${simDen})`;
        } else if (tenths === 0) {
            fracStr = integer.toString();
        }

        document.getElementById("strahl-frac-val").textContent = fracStr;
    }

    function drawZahlenstrahl() {
        const canvas = document.getElementById("canvas-zahlenstrahl");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const startX = 30;
        const endX = canvas.width - 30;
        const width = endX - startX;
        
        const mainY = 50;
        const zoomY = 140;

        // Get colors
        const textColor = getComputedStyle(document.body).getPropertyValue("--text-main").trim() || "#000000";
        const primaryColor = "#7c3aed"; // Purple for 6.3

        // --- DRAW UPPER LINE (0 TO 10) ---
        ctx.beginPath();
        ctx.moveTo(startX, mainY);
        ctx.lineTo(endX, mainY);
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Upper Ticks (0, 1, ..., 10)
        const stepMain = width / 10;
        for (let i = 0; i <= 10; i++) {
            const tx = startX + i * stepMain;
            ctx.beginPath();
            ctx.moveTo(tx, mainY - 6);
            ctx.lineTo(tx, mainY + 6);
            ctx.lineWidth = i === state.zahlenstrahlVal ? 4 : 2;
            ctx.strokeStyle = i === state.zahlenstrahlVal ? primaryColor : "#475569";
            ctx.stroke();

            // Label
            ctx.fillStyle = textColor;
            ctx.font = i === state.zahlenstrahlVal ? "bold 12px sans-serif" : "11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(i.toString(), tx, mainY - 14);
        }

        // Highlight selected Einer section with background zoom lines
        const activeX1 = startX + state.zahlenstrahlVal * stepMain;
        const activeX2 = startX + (state.zahlenstrahlVal + 1) * stepMain;

        // Draw magnification trapezoid lines
        ctx.fillStyle = "rgba(124, 58, 237, 0.05)";
        ctx.beginPath();
        ctx.moveTo(activeX1, mainY + 6);
        ctx.lineTo(activeX2, mainY + 6);
        ctx.lineTo(endX, zoomY - 10);
        ctx.lineTo(startX, zoomY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "rgba(124, 58, 237, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(activeX1, mainY + 6);
        ctx.lineTo(startX, zoomY - 10);
        ctx.moveTo(activeX2, mainY + 6);
        ctx.lineTo(endX, zoomY - 10);
        ctx.stroke();

        // --- DRAW LOWER ZOOMED LINE ---
        ctx.beginPath();
        ctx.moveTo(startX, zoomY);
        ctx.lineTo(endX, zoomY);
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Zoomed Ticks (Zehntel: 1.0, 1.1, ..., 2.0)
        const startVal = state.zahlenstrahlVal;
        const stepZoom = width / 10;
        
        for (let i = 0; i <= 10; i++) {
            const tx = startX + i * stepZoom;
            const currentDec = startVal + i / 10;

            ctx.beginPath();
            ctx.moveTo(tx, zoomY - 8);
            ctx.lineTo(tx, zoomY + 8);
            ctx.lineWidth = 2;
            ctx.strokeStyle = primaryColor;
            ctx.stroke();

            // Draw label
            ctx.fillStyle = textColor;
            ctx.font = Math.abs(currentDec - state.zahlenstrahlDec) < 0.01 ? "bold 11px sans-serif" : "10px sans-serif";
            ctx.fillText(currentDec.toFixed(1), tx, zoomY + 22);

            // Minor ticks at 0.05
            if (i < 10) {
                const minorX = tx + stepZoom / 2;
                ctx.beginPath();
                ctx.moveTo(minorX, zoomY - 4);
                ctx.lineTo(minorX, zoomY + 4);
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#a78bfa";
                ctx.stroke();
            }
        }

        // Draw Pointer on selected zoomed value
        const decimalOffset = state.zahlenstrahlDec - startVal;
        const pointerX = startX + decimalOffset * 10 * stepZoom;
        
        ctx.beginPath();
        ctx.moveTo(pointerX, zoomY - 15);
        ctx.lineTo(pointerX - 8, zoomY - 27);
        ctx.lineTo(pointerX + 8, zoomY - 27);
        ctx.closePath();
        ctx.fillStyle = primaryColor;
        ctx.fill();

        // Draw pin indicator dot
        ctx.beginPath();
        ctx.arc(pointerX, zoomY, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }

    // --- WIDGET 6.3: STELLENWERTTAFEL ---
    function initStellenwerttafel() {
        const grid = document.querySelector(".stellenwert-grid");
        if (!grid) return;

        // Bind columns + and - buttons
        const cols = ["H", "Z", "E", "z", "h", "t"];
        cols.forEach(col => {
            const colEl = document.querySelector(`.sw-column[data-col="${col}"]`);
            if (colEl) {
                const btnAdd = colEl.querySelector(".btn-sw-add");
                const btnSub = colEl.querySelector(".btn-sw-sub");

                btnAdd.addEventListener("click", () => {
                    if (state.swTokens[col] < 9) {
                        state.swTokens[col]++;
                        renderStellenwerttafel();
                    }
                });

                btnSub.addEventListener("click", () => {
                    if (state.swTokens[col] > 0) {
                        state.swTokens[col]--;
                        renderStellenwerttafel();
                    }
                });
            }
        });

        // Math shift buttons
        document.getElementById("btn-sw-mult10").addEventListener("click", () => shiftTokens(1));
        document.getElementById("btn-sw-div10").addEventListener("click", () => shiftTokens(-1));
        document.getElementById("btn-sw-mult100").addEventListener("click", () => shiftTokens(2));
        document.getElementById("btn-sw-div100").addEventListener("click", () => shiftTokens(-2));
        
        document.getElementById("btn-sw-clear").addEventListener("click", () => {
            cols.forEach(c => state.swTokens[c] = 0);
            renderStellenwerttafel();
        });

        function shiftTokens(steps) {
            // cols order left to right: H, Z, E, z, h, t
            const newTokens = { H: 0, Z: 0, E: 0, z: 0, h: 0, t: 0 };
            
            for (let i = 0; i < cols.length; i++) {
                const currentCol = cols[i];
                const currentCount = state.swTokens[currentCol];

                // calculate new column index
                const targetIdx = i - steps;
                if (targetIdx >= 0 && targetIdx < cols.length) {
                    const targetCol = cols[targetIdx];
                    newTokens[targetCol] = currentCount;
                }
            }

            state.swTokens = newTokens;
            renderStellenwerttafel();
        }

        // Initial render
        renderStellenwerttafel();
    }

    function renderStellenwerttafel() {
        const cols = ["H", "Z", "E", "z", "h", "t"];
        let sum = 0;

        // Multiply values
        const multipliers = { H: 100, Z: 10, E: 1, z: 0.1, h: 0.01, t: 0.001 };

        cols.forEach(col => {
            const count = state.swTokens[col];
            
            // Update counter text
            document.getElementById(`sw-count-${col}`).textContent = count;

            // Render Dots
            const dotsContainer = document.getElementById(`sw-dots-${col}`);
            dotsContainer.innerHTML = "";
            for (let i = 0; i < count; i++) {
                const dot = document.createElement("div");
                dot.className = "sw-dot";
                dotsContainer.appendChild(dot);
            }

            // Accumulate sum
            sum += count * multipliers[col];
        });

        // Set total display
        document.getElementById("sw-total-val").textContent = parseFloat(sum.toFixed(3));
    }

    // --- CONFETTI ANIMATION ---
    function triggerConfetti() {
        const canvas = document.getElementById("confetti-canvas");
        if (!canvas) return;
        
        canvas.style.display = "block";
        const ctx = canvas.getContext("2d");
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
        const particleCount = 100;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                radius: Math.random() * 5 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 5 + 3,
                speedX: Math.random() * 4 - 2,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 2 - 1
            });
        }
        
        let animationFrame;
        let elapsed = 0;
        
        function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;
            
            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;
                
                if (p.y < canvas.height) {
                    active = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius);
                    ctx.restore();
                }
            });
            
            elapsed++;
            if (active && elapsed < 180) {
                animationFrame = requestAnimationFrame(update);
            } else {
                canvas.style.display = "none";
                cancelAnimationFrame(animationFrame);
            }
        }
        
        update();
    }

    // --- QUIZ QUESTIONS DATA ---
    const quiz61Data = [
        {
            q: "Was stellt der Zähler in einem Bruch dar?",
            opts: ["In wie viele Teile das Ganze geteilt wurde.", "Wie viele der gleichen Teile ausgewählt wurden.", "Die Grösse des Ganzen.", "Die Summe der Vielfachen."],
            ans: 1
        },
        {
            q: "Was ist das kleinste gemeinsame Vielfache (kgV) von 6 und 8?",
            opts: ["2", "14", "24", "48"],
            ans: 2
        },
        {
            q: "Welche der folgenden Zahlen ist EINE Primzahl?",
            opts: ["9", "15", "29", "51"],
            ans: 2
        },
        {
            q: "Erweitere den Bruch 3/5 auf den Nenner 20. Wie lautet der neue Bruch?",
            opts: ["6/20", "9/20", "12/20", "15/20"],
            ans: 2
        },
        {
            q: "Berechne 2/3 von 90 Meter.",
            opts: ["30 Meter", "60 Meter", "45 Meter", "80 Meter"],
            ans: 1
        }
    ];

    const quiz62Data = [
        {
            q: "Wo liegt der Punkt P(1.5 | 4) im Koordinatensystem?",
            opts: ["Genau in der Mitte zwischen 1 und 2 auf der Y-Achse, und auf Höhe 4 auf der X-Achse.", "Genau in der Mitte zwischen 1 und 2 auf der X-Achse, und auf Höhe 4 auf der Y-Achse.", "Auf Position 1.5 auf der X-Achse und Position 0 auf der Y-Achse.", "Bei X=4 und Y=1.5."],
            ans: 1
        },
        {
            q: "Welche Eigenschaften haben die Diagonalen eines Quadrats?",
            opts: ["Sie sind unterschiedlich lang, halbieren sich und stehen im rechten Winkel aufeinander.", "Sie sind gleich lang, halbieren sich und stehen im rechten Winkel aufeinander.", "Sie sind gleich lang, halbieren sich aber stehen nicht im rechten Winkel aufeinander.", "Sie schneiden sich nicht."],
            ans: 1
        },
        {
            q: "Ein Winkel misst genau 95°. Wie nennt man diese Winkelart?",
            opts: ["Spitzer Winkel", "Rechter Winkel", "Stumpfer Winkel", "Überstumpfer Winkel"],
            ans: 2
        },
        {
            q: "Auf einer Wanderkarte mit dem Massstab 1 : 25'000 misst eine Strecke 4 cm. Wie lang ist sie in der Wirklichkeit?",
            opts: ["100 Meter (0.1 km)", "1'000 Meter (1.0 km)", "10'000 Meter (10 km)", "250 Meter (0.25 km)"],
            ans: 1
        },
        {
            q: "Wie gross ist die Summe aller Winkel in einem Dreieck?",
            opts: ["90°", "180°", "360°", "Es ist immer unterschiedlich."],
            ans: 1
        }
    ];

    const quiz63Data = [
        {
            q: "Bestimme die Nachbar-Zehntel der Zahl 4.567.",
            opts: ["4 und 5", "4.5 und 4.6", "4.56 und 4.57", "4.560 und 4.570"],
            ans: 1
        },
        {
            q: "Verschiebe die Ziffern der Zahl 0.35 um eine Stelle nach links (Multiplikation mit 10). Was ist das Ergebnis?",
            opts: ["0.035", "3.5", "35.0", "3.05"],
            ans: 1
        },
        {
            q: "Wie lautet der Bruch 3/4 als Dezimalzahl?",
            opts: ["0.3", "0.34", "0.75", "1.34"],
            ans: 2
        },
        {
            q: "Welcher Bruch entspricht genau dem Dezimalwert 0.2?",
            opts: ["1/2", "1/5", "1/20", "2/100"],
            ans: 1
        },
        {
            q: "Vergleiche die Brüche: Welches Zeichen gehört dazwischen?  2/3 ____ 5/6",
            opts: ["< (kleiner als)", "> (grösser als)", "= (gleich gross)", "/ (nicht vergleichbar)"],
            ans: 0
        }
    ];

    // --- QUIZ IMPLEMENTATION BUILDER ---
    function initQuiz(quizId, questions, quizStateKey) {
        const container = document.getElementById(`quiz-${quizId}-container`);
        if (!container) return;

        const introDiv = container.querySelector(".quiz-intro");
        const activeDiv = container.querySelector(".quiz-active");
        const resultDiv = container.querySelector(".quiz-result");
        const startBtn = container.querySelector(`.quiz-intro button`);
        const restartBtn = container.querySelector(`.quiz-result button`);
        
        const qNumSpan = document.getElementById(`quiz-${quizId}-qnum`);
        const qTextH4 = document.getElementById(`quiz-${quizId}-qtext`);
        const qOptionsDiv = document.getElementById(`quiz-${quizId}-options`);
        const progressFill = document.getElementById(`quiz-${quizId}-progress`);

        let currentIdx = 0;
        let score = 0;

        startBtn.addEventListener("click", () => {
            currentIdx = 0;
            score = 0;
            introDiv.style.display = "none";
            activeDiv.style.display = "flex";
            resultDiv.style.display = "none";
            renderQuestion();
        });

        restartBtn.addEventListener("click", () => {
            currentIdx = 0;
            score = 0;
            introDiv.style.display = "none";
            activeDiv.style.display = "flex";
            resultDiv.style.display = "none";
            renderQuestion();
        });

        function renderQuestion() {
            const qData = questions[currentIdx];
            
            const percent = (currentIdx / questions.length) * 100;
            progressFill.style.width = `${percent}%`;

            qNumSpan.textContent = `Frage ${currentIdx + 1} von ${questions.length}`;
            qTextH4.textContent = qData.q;
            qOptionsDiv.innerHTML = "";

            qData.opts.forEach((opt, idx) => {
                const btn = document.createElement("button");
                btn.className = "quiz-opt-btn";
                btn.textContent = opt;
                btn.addEventListener("click", () => handleSelect(idx, btn));
                qOptionsDiv.appendChild(btn);
            });
        }

        function handleSelect(selectedIdx, clickedBtn) {
            const qData = questions[currentIdx];
            const buttons = qOptionsDiv.querySelectorAll(".quiz-opt-btn");
            
            buttons.forEach(b => b.disabled = true);

            if (selectedIdx === qData.ans) {
                clickedBtn.classList.add("correct");
                score++;
            } else {
                clickedBtn.classList.add("wrong");
                buttons[qData.ans].classList.add("correct");
            }

            setTimeout(() => {
                currentIdx++;
                if (currentIdx < questions.length) {
                    renderQuestion();
                } else {
                    showResults();
                }
            }, 1500);
        }

        function showResults() {
            activeDiv.style.display = "none";
            resultDiv.style.display = "flex";

            progressFill.style.width = "100%";

            const resultText = document.getElementById(`quiz-${quizId}-result-text`);
            const stars = document.getElementById(`quiz-${quizId}-stars`);
            const pointsSpan = document.getElementById(`quiz-${quizId}-points`);

            let starsStr = "";
            for (let i = 0; i < 5; i++) {
                starsStr += i < score ? "⭐" : "☆";
            }
            stars.textContent = starsStr;

            resultText.textContent = `Du hast ${score} von ${questions.length} Fragen richtig beantwortet!`;
            
            const earnedPoints = score * 10;
            pointsSpan.textContent = earnedPoints;

            if (!state.completedQuizzes[quizStateKey]) {
                addPoints(earnedPoints);
                state.completedQuizzes[quizStateKey] = true;
                localStorage.setItem("completedQuizzes", JSON.stringify(state.completedQuizzes));
                updateTotalProgress();
            }

            if (score === 5) {
                triggerConfetti();
                resultText.innerHTML += "<br><strong>🎉 Perfekte Punktzahl! Ausgezeichnet! 🎉</strong>";
            }
        }
    }

    function initQuiz61() {
        initQuiz("61", quiz61Data, "q61");
    }

    function initQuiz62() {
        initQuiz("62", quiz62Data, "q62");
    }

    function initQuiz63() {
        initQuiz("63", quiz63Data, "q63");
    }

});
