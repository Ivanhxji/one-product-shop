/* ============================================================
   EXPLODED VIEW — Three.js 3D animation
   Style: Sony camera exploded — warm light from below,
   metallic components, dramatic perspective
   ============================================================ */

(function () {
    'use strict';

    function init() {
        if (typeof THREE === 'undefined') {
            setTimeout(init, 200); // retry if Three.js not ready yet
            return;
        }

        const canvas = document.getElementById('explodedCanvas');
        if (!canvas) return;

        const wrap = canvas.parentElement;
        let W = wrap.clientWidth;
        let H = Math.round(W * 0.72);
        H = Math.max(480, Math.min(680, H));

        // ── Renderer ──────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        // ── Scene ─────────────────────────────────────────────
        const scene = new THREE.Scene();

        // ── Camera — Sony-style angle: above + slight front-right ──
        const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 60);
        camera.position.set(1.8, 5.5, 8.5);
        const camTarget = new THREE.Vector3(0, 0.3, 0);
        camera.lookAt(camTarget);

        // Orbit vars — camera orbits continuously, speed varies by state
        const camRadius = Math.sqrt(1.8 * 1.8 + 8.5 * 8.5);
        let camAngle = Math.atan2(1.8, 8.5);
        let camOrbitSpeed = 0.0008; // slow during assembly
        const CAM_SPEED_SLOW = 0.0008;
        const CAM_SPEED_FAST = 0.0028;

        // ── Lighting — dramatic, warm from below like Sony ────
        // Ambient (cool dark)
        scene.add(new THREE.AmbientLight(0x1a2040, 1.2));

        // Main studio key light (upper right, bright)
        const key = new THREE.DirectionalLight(0xffffff, 2.0);
        key.position.set(4, 8, 5);
        key.castShadow = true;
        key.shadow.mapSize.set(2048, 2048);
        key.shadow.camera.near = 0.5;
        key.shadow.camera.far = 30;
        key.shadow.camera.left = -6;
        key.shadow.camera.right = 6;
        key.shadow.camera.top = 6;
        key.shadow.camera.bottom = -6;
        scene.add(key);

        // Warm orange fill from below (Sony signature)
        const warm = new THREE.PointLight(0xff5500, 5.0, 20);
        warm.position.set(0.5, -3.5, 2.5);
        scene.add(warm);

        // Second warm from front-bottom
        const warm2 = new THREE.PointLight(0xff3300, 2.5, 12);
        warm2.position.set(-2, -2, 4);
        scene.add(warm2);

        // Cool blue rim from behind-left
        const rim = new THREE.DirectionalLight(0x3355ff, 0.6);
        rim.position.set(-5, 2, -4);
        scene.add(rim);

        // ── Materials ─────────────────────────────────────────
        const matShell = new THREE.MeshStandardMaterial({
            color: 0x3c4258,
            roughness: 0.12,
            metalness: 0.95,
        });
        const matShellBottom = new THREE.MeshStandardMaterial({
            color: 0x252b3a,
            roughness: 0.15,
            metalness: 0.9,
        });
        const matPCB = new THREE.MeshStandardMaterial({
            color: 0x0b2212,
            roughness: 0.45,
            metalness: 0.08,
        });
        const matChipBody = new THREE.MeshStandardMaterial({
            color: 0x111118,
            roughness: 0.05,
            metalness: 0.98,
        });
        const matChipGold = new THREE.MeshStandardMaterial({
            color: 0xc8900a,
            roughness: 0.04,
            metalness: 1.0,
        });
        const matGold = new THREE.MeshStandardMaterial({
            color: 0xd4a520,
            roughness: 0.05,
            metalness: 1.0,
        });
        const matAntenna = new THREE.MeshStandardMaterial({
            color: 0x162010,
            roughness: 0.35,
            metalness: 0.1,
        });
        const matTrace = new THREE.MeshStandardMaterial({
            color: 0xb07800,
            roughness: 0.1,
            metalness: 0.9,
            emissive: 0x301800,
            emissiveIntensity: 0.3,
        });
        const matFlash = new THREE.MeshStandardMaterial({
            color: 0x0a0a14,
            roughness: 0.06,
            metalness: 0.97,
        });
        const matSilver = new THREE.MeshStandardMaterial({
            color: 0x8090a8,
            roughness: 0.1,
            metalness: 0.9,
        });

        // ── Helper ────────────────────────────────────────────
        function mesh(geo, mat) {
            const m = new THREE.Mesh(geo, mat);
            m.castShadow = true;
            m.receiveShadow = true;
            return m;
        }

        // ── Build component groups ─────────────────────────────
        const parts = []; // { group, assembledY, explodedY, rx, rz }

        // ─── 1. TOP HOUSING SHELL ───────────────────────────
        const g1 = new THREE.Group();
        // Main body
        const shellBody = mesh(new THREE.BoxGeometry(2.5, 0.22, 2.5), matShell);
        g1.add(shellBody);
        // Edge bevel (thin strips around perimeter)
        const edgeH = mesh(new THREE.BoxGeometry(2.52, 0.04, 0.04), matSilver);
        edgeH.position.set(0, 0.09, 1.24); g1.add(edgeH);
        const edgeH2 = edgeH.clone(); edgeH2.position.set(0, 0.09, -1.24); g1.add(edgeH2);
        const edgeV = mesh(new THREE.BoxGeometry(0.04, 0.04, 2.52), matSilver);
        edgeV.position.set(1.24, 0.09, 0); g1.add(edgeV);
        const edgeV2 = edgeV.clone(); edgeV2.position.set(-1.24, 0.09, 0); g1.add(edgeV2);
        // Logo impression (small raised square)
        const logo = mesh(new THREE.BoxGeometry(0.6, 0.02, 0.35), matSilver);
        logo.position.set(0, 0.12, 0); g1.add(logo);
        // LED dot
        const ledMat = new THREE.MeshStandardMaterial({
            color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 2.0, roughness: 0.2, metalness: 0
        });
        const led = mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.025, 16), ledMat);
        led.position.set(-0.95, 0.115, 0.95); g1.add(led);
        scene.add(g1);
        // Make top shell more accurate to the square adapter shape
        g1.scale.set(0.92, 1, 0.92); // slightly smaller to match square proportions
        parts.push({ group: g1, assembledY: 0.11, explodedY: 3.2, explodedX: -0.15, explodedZ: -0.3, rx: -0.06, rz: 0.04 });

        // ─── 2. WIFI ANTENNA MODULE ─────────────────────────
        const g2 = new THREE.Group();
        const antBoard = mesh(new THREE.BoxGeometry(2.1, 0.05, 0.22), matAntenna);
        g2.add(antBoard);
        // Antenna trace (zigzag via small boxes)
        for (let i = 0; i < 6; i++) {
            const seg = mesh(new THREE.BoxGeometry(0.28, 0.025, 0.02), matTrace);
            seg.position.set(-0.7 + i * 0.28, 0.036, i % 2 === 0 ? 0.04 : -0.04);
            g2.add(seg);
        }
        // Chip on antenna
        const antChip = mesh(new THREE.BoxGeometry(0.2, 0.06, 0.18), matChipBody);
        antChip.position.set(0.75, 0.054, 0); g2.add(antChip);
        // Gold pins on chip
        for (let i = -2; i <= 2; i++) {
            const pin = mesh(new THREE.BoxGeometry(0.02, 0.03, 0.04), matChipGold);
            pin.position.set(0.75 + i * 0.04, 0.028, 0.1); g2.add(pin);
            const pin2 = pin.clone(); pin2.position.z = -0.1; g2.add(pin2);
        }
        scene.add(g2);
        parts.push({ group: g2, assembledY: 0, explodedY: 1.7, explodedX: 0.4, explodedZ: 0.2, rx: 0.1, rz: -0.12 });

        // ─── 3. MAIN PCB ────────────────────────────────────
        const g3 = new THREE.Group();
        const pcbBoard = mesh(new THREE.BoxGeometry(2.2, 0.06, 2.2), matPCB);
        g3.add(pcbBoard);
        // Gold trace lines
        const traceH = mesh(new THREE.BoxGeometry(1.4, 0.004, 0.018), matTrace);
        traceH.position.set(0, 0.032, 0.3); g3.add(traceH);
        const traceH2 = traceH.clone(); traceH2.position.set(0.2, 0.032, -0.3); g3.add(traceH2);
        const traceV = mesh(new THREE.BoxGeometry(0.018, 0.004, 1.0), matTrace);
        traceV.position.set(0.5, 0.032, 0); g3.add(traceV);
        const traceV2 = traceV.clone(); traceV2.position.set(-0.5, 0.032, 0.2); g3.add(traceV2);
        // Solder pads (gold dots)
        for (let x = -4; x <= 4; x++) {
            for (let z = -4; z <= 4; z++) {
                if (Math.abs(x) > 2 || Math.abs(z) > 2) {
                    const pad = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.005, 8), matTrace);
                    pad.position.set(x * 0.24, 0.033, z * 0.24); g3.add(pad);
                }
            }
        }
        scene.add(g3);
        parts.push({ group: g3, assembledY: -0.08, explodedY: 0.5, explodedX: 0.1, explodedZ: 0.1, rx: -0.08, rz: 0.06 });

        // ─── 4. WIFI + BT SOC CHIP ──────────────────────────
        const g4 = new THREE.Group();
        // Chip package (main body)
        const socBody = mesh(new THREE.BoxGeometry(0.75, 0.14, 0.75), matChipBody);
        g4.add(socBody);
        // Top markings (tiny silver lines)
        const mark1 = mesh(new THREE.BoxGeometry(0.5, 0.005, 0.03), matSilver);
        mark1.position.set(0, 0.073, -0.1); g4.add(mark1);
        const mark2 = mesh(new THREE.BoxGeometry(0.3, 0.005, 0.03), matSilver);
        mark2.position.set(-0.1, 0.073, 0.1); g4.add(mark2);
        const mark3 = mesh(new THREE.BoxGeometry(0.02, 0.005, 0.02), matChipGold);
        mark3.position.set(-0.3, 0.073, -0.3); g4.add(mark3); // orientation dot
        // BGA solder balls underneath (gold dots grid)
        for (let x = -2; x <= 2; x++) {
            for (let z = -2; z <= 2; z++) {
                const ball = mesh(new THREE.SphereGeometry(0.025, 6, 6), matChipGold);
                ball.position.set(x * 0.12, -0.09, z * 0.12); g4.add(ball);
            }
        }
        // Decoupling capacitors (tiny boxes next to chip)
        for (let i = 0; i < 4; i++) {
            const cap = mesh(new THREE.BoxGeometry(0.06, 0.05, 0.035), matChipBody);
            cap.position.set(0.45, 0, -0.25 + i * 0.15); g4.add(cap);
        }
        scene.add(g4);
        parts.push({ group: g4, assembledY: -0.17, explodedY: -0.5, explodedX: -0.5, explodedZ: 0.3, rx: 0.12, rz: -0.15 });

        // ─── 5. FLASH MEMORY CHIP ───────────────────────────
        const g5 = new THREE.Group();
        const flashBody = mesh(new THREE.BoxGeometry(0.42, 0.1, 0.55), matFlash);
        g5.add(flashBody);
        // SOIC pins (gold leads on sides)
        for (let i = 0; i < 4; i++) {
            const pinL = mesh(new THREE.BoxGeometry(0.06, 0.02, 0.06), matChipGold);
            pinL.position.set(-0.25, -0.03, -0.18 + i * 0.12); g5.add(pinL);
            const pinR = pinL.clone(); pinR.position.x = 0.25; g5.add(pinR);
        }
        // Text marking
        const topMark = mesh(new THREE.BoxGeometry(0.28, 0.004, 0.06), matSilver);
        topMark.position.set(0, 0.052, 0); g5.add(topMark);
        scene.add(g5);
        parts.push({ group: g5, assembledY: -0.22, explodedY: -1.6, explodedX: 0.6, explodedZ: -0.2, rx: -0.15, rz: 0.18 });

        // ─── 6. USB-A CONNECTOR ─────────────────────────────
        const g6 = new THREE.Group();

        // Outer metal housing — larger so it reads well
        const usbShell = mesh(new THREE.BoxGeometry(1.15, 0.40, 0.56), matSilver);
        g6.add(usbShell);

        // Subtle edge highlight on housing
        const usbEdge = mesh(new THREE.BoxGeometry(1.17, 0.04, 0.04), new THREE.MeshStandardMaterial({
            color: 0xd0d8e8, roughness: 0.05, metalness: 1.0
        }));
        usbEdge.position.set(0, 0.18, 0.27); g6.add(usbEdge);
        const usbEdge2 = usbEdge.clone(); usbEdge2.position.z = -0.27; g6.add(usbEdge2);

        // Inner opening — black cavity, slightly recessed
        const usbCavity = mesh(new THREE.BoxGeometry(0.9, 0.28, 0.58), new THREE.MeshStandardMaterial({
            color: 0x060608, roughness: 1.0, metalness: 0.0
        }));
        usbCavity.position.set(0.14, 0, 0); g6.add(usbCavity);

        // White plastic tongue (USB standard)
        const tongue = mesh(new THREE.BoxGeometry(0.72, 0.1, 0.3), new THREE.MeshStandardMaterial({
            color: 0xe8e8f0, roughness: 0.6, metalness: 0.0
        }));
        tongue.position.set(0.14, -0.04, 0); g6.add(tongue);

        // Gold contacts — 4 wide, clearly visible
        for (let i = 0; i < 4; i++) {
            const contact = mesh(new THREE.BoxGeometry(0.62, 0.035, 0.05), matGold);
            contact.position.set(0.14, 0.03, -0.12 + i * 0.08);
            g6.add(contact);
        }

        // Inner glow — emissive warm light inside the port
        const portGlow = mesh(new THREE.BoxGeometry(0.7, 0.22, 0.28), new THREE.MeshStandardMaterial({
            color: 0xd4900a,
            emissive: 0xd4700a,
            emissiveIntensity: 0.6,
            roughness: 1.0,
            metalness: 0.0,
            transparent: true,
            opacity: 0.18
        }));
        portGlow.position.set(0.14, 0, 0); g6.add(portGlow);

        // Back solder pins (PCB legs visible from camera)
        for (let i = 0; i < 4; i++) {
            const pin = mesh(new THREE.BoxGeometry(0.04, 0.22, 0.025), matGold);
            pin.position.set(-0.4 + i * 0.1, 0, 0.3); g6.add(pin);
        }
        // Ground tabs (wider flat)
        const gndTab = mesh(new THREE.BoxGeometry(0.06, 0.06, 0.025), matSilver);
        gndTab.position.set(-0.52, -0.16, 0.3); g6.add(gndTab);
        const gndTab2 = gndTab.clone(); gndTab2.position.x = 0.52; g6.add(gndTab2);

        scene.add(g6);
        // Tilt toward camera so opening is visible + offset X so it doesn't hide behind other parts
        // USB connector sits at bottom of device, explodes straight down below g7
        parts.push({ group: g6, assembledY: -0.33, explodedY: -5.5, explodedX: 0.15, explodedZ: -0.25, rx: 0.08, rz: 0 });

        // ─── 7. BOTTOM HOUSING SHELL ────────────────────────
        const g7 = new THREE.Group();
        const botBody = mesh(new THREE.BoxGeometry(2.5, 0.22, 2.5), matShellBottom);
        g7.add(botBody);

        // USB-A port on BOTTOM face — opening faces DOWN (y=-0.11 local)
        // Visible when g7 explodes downward and camera looks at top of g7

        // Outer silver rim around USB-A hole (on bottom face)
        const usbARim = mesh(new THREE.BoxGeometry(1.06, 0.08, 0.58), new THREE.MeshStandardMaterial({
            color: 0x9ab0c8, roughness: 0.06, metalness: 0.97
        }));
        usbARim.position.set(0.2, -0.11, 0.3); g7.add(usbARim);

        // USB-A dark cavity — protrudes below bottom face
        const cutoutUSBA = mesh(new THREE.BoxGeometry(0.92, 0.18, 0.46), new THREE.MeshStandardMaterial({
            color: 0x020204, roughness: 1.0, metalness: 0
        }));
        cutoutUSBA.position.set(0.2, -0.11, 0.3); g7.add(cutoutUSBA);

        // USB-A inner glow — warm amber emissive, visible from above when part drops
        const usbAGlow = mesh(new THREE.BoxGeometry(0.78, 0.14, 0.36), new THREE.MeshStandardMaterial({
            color: 0xd06810,
            emissive: 0xc04800,
            emissiveIntensity: 1.4,
            roughness: 1.0,
            metalness: 0.0,
            transparent: true,
            opacity: 0.5
        }));
        usbAGlow.position.set(0.2, -0.11, 0.3); g7.add(usbAGlow);

        // PointLight inside USB-A hole — illuminates surrounding housing from below
        const usbALight = new THREE.PointLight(0xff7000, 2.5, 2.8);
        usbALight.position.set(0.2, -0.18, 0.3);
        g7.add(usbALight);

        // USB-C port on BOTTOM face — next to USB-A
        const usbCRim = mesh(new THREE.BoxGeometry(0.42, 0.08, 0.32), new THREE.MeshStandardMaterial({
            color: 0x9ab0c8, roughness: 0.06, metalness: 0.97
        }));
        usbCRim.position.set(-0.6, -0.11, 0.3); g7.add(usbCRim);

        const cutoutUSBC = mesh(new THREE.BoxGeometry(0.32, 0.18, 0.22), new THREE.MeshStandardMaterial({
            color: 0x020204, roughness: 1.0, metalness: 0
        }));
        cutoutUSBC.position.set(-0.6, -0.11, 0.3); g7.add(cutoutUSBC);

        // USB-C inner glow — cool blue (data/power port)
        const usbCGlow = mesh(new THREE.BoxGeometry(0.24, 0.12, 0.16), new THREE.MeshStandardMaterial({
            color: 0x2060d0,
            emissive: 0x1040b0,
            emissiveIntensity: 1.1,
            roughness: 1.0,
            metalness: 0.0,
            transparent: true,
            opacity: 0.4
        }));
        usbCGlow.position.set(-0.6, -0.11, 0.3); g7.add(usbCGlow);

        // Bottom edge bevel (all 4 sides)
        const edgeBH = mesh(new THREE.BoxGeometry(2.52, 0.04, 0.04), matSilver);
        edgeBH.position.set(0, -0.09, 1.24); g7.add(edgeBH);
        const edgeBH2 = edgeBH.clone(); edgeBH2.position.z = -1.24; g7.add(edgeBH2);
        const edgeBV = mesh(new THREE.BoxGeometry(0.04, 0.04, 2.52), matSilver);
        edgeBV.position.set(1.24, -0.09, 0); g7.add(edgeBV);
        const edgeBV2 = edgeBV.clone(); edgeBV2.position.x = -1.24; g7.add(edgeBV2);

        scene.add(g7);
        // Tilt more when exploded so camera (above) sees bottom face with USB holes
        parts.push({ group: g7, assembledY: -0.22, explodedY: -3.8, explodedX: 0.2, explodedZ: -0.4, rx: 0.55, rz: -0.04 });

        // ── Set initial assembled positions ────────────────
        parts.forEach(p => {
            p.group.position.y = p.assembledY;
            p.group.rotation.x = 0;
            p.group.rotation.z = 0;
        });

        // ── Animation loop ─────────────────────────────────
        let animState = 'assembled'; // 'assembled' | 'exploding' | 'exploded' | 'assembling'
        let animTimer = null;

        function explode() {
            if (animState === 'exploding' || animState === 'exploded') return;
            animState = 'exploding';
            clearTimeout(animTimer);

            let done = 0;
            parts.forEach((p, i) => {
                gsap.to(p.group.position, {
                    x: p.explodedX || 0,
                    y: p.explodedY,
                    z: p.explodedZ || 0,
                    duration: 1.8,
                    delay: i * 0.09,
                    ease: 'power3.out',
                    onComplete: () => {
                        done++;
                        if (done === parts.length) {
                            animState = 'exploded';
                            camOrbitSpeed = CAM_SPEED_FAST;
                            animTimer = setTimeout(assemble, 3000);
                        }
                    }
                });
                gsap.to(p.group.rotation, {
                    x: p.rx, z: p.rz,
                    duration: 1.8,
                    delay: i * 0.09,
                    ease: 'power3.out'
                });
            });

            // Gentle float when exploded — each part has unique rhythm
            setTimeout(() => {
                if (animState !== 'exploding') return;
                parts.forEach((p, i) => {
                    const amp = 0.06 + (i % 3) * 0.03;
                    const dur = 1.8 + (i % 4) * 0.4;
                    gsap.to(p.group.position, {
                        y: p.explodedY + (i % 2 === 0 ? amp : -amp),
                        duration: dur,
                        yoyo: true,
                        repeat: -1,
                        ease: 'sine.inOut'
                    });
                });
            }, 2000);
        }

        function assemble() {
            if (animState === 'assembling' || animState === 'assembled') return;
            animState = 'assembling';
            clearTimeout(animTimer);

            camOrbitSpeed = CAM_SPEED_SLOW; // slow down during assembly, never stop

            parts.forEach(p => gsap.killTweensOf(p.group.position));

            let done = 0;
            parts.forEach((p, i) => {
                const delay = (parts.length - 1 - i) * 0.07;
                gsap.to(p.group.position, {
                    x: 0, y: p.assembledY, z: 0,
                    duration: 1.5,
                    delay,
                    ease: 'power3.inOut',
                    onComplete: () => { done++; if (done === parts.length) { animState = 'assembled'; animTimer = setTimeout(explode, 1500); } }
                });
                gsap.to(p.group.rotation, {
                    x: 0, z: 0,
                    duration: 1.5,
                    delay,
                    ease: 'power3.inOut'
                });
            });
        }

        // Start cycle
        setTimeout(explode, 1200);

        // ── Render loop ────────────────────────────────────
        function animate() {
            requestAnimationFrame(animate);

            const t = Date.now();

            // 1. Continuous camera orbit — speed varies by state
            camAngle += camOrbitSpeed;
            camera.position.x = Math.sin(camAngle) * camRadius;
            camera.position.z = Math.cos(camAngle) * camRadius;
            camera.lookAt(camTarget);

            // 2. LED heartbeat pulse
            ledMat.emissiveIntensity = 1.4 + Math.sin(t * 0.0025) * 0.7;

            // 3. PCB trace glow brightens when exploded
            matTrace.emissiveIntensity = animState === 'exploded'
                ? 0.5 + Math.sin(t * 0.0018) * 0.3
                : 0.3;

            // 4. USB-A port glow — slow breathing pulse
            usbAGlow.material.emissiveIntensity = 0.9 + Math.sin(t * 0.0012) * 0.4;
            usbALight.intensity = 1.6 + Math.sin(t * 0.0012) * 0.8;

            renderer.render(scene, camera);
        }
        animate();

        // ── Resize ─────────────────────────────────────────
        window.addEventListener('resize', function () {
            W = wrap.clientWidth;
            H = Math.round(W * 0.72);
            H = Math.max(480, Math.min(680, H));
            camera.aspect = W / H;
            camera.updateProjectionMatrix();
            renderer.setSize(W, H);
        });
    }

    // Run immediately — scripts at bottom of body, DOM is ready
    // If Three.js CDN not ready yet, init() retries every 200ms
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
