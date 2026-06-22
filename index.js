const crypto = require('crypto');

// Mapeo estricto de tus acortadores de Work.ink con soporte extendido para 6 pasos
const WORKINK_LINKS = {
    paso1: "https://lootdest.org/s?O24c1Z7b",
    paso2: "https://lootdest.org/s?jHFFq3fi",
    paso3: "https://lootdest.org/s?MaueoAkS",
    paso4: "https://lootdest.org/s?42EZi32t",
    paso5: "https://loot-link.com/s?Ifcot6Qt",
    paso6: "https://loot-link.com/s?MBAgY2KX"
};

// Secreto interno del servidor
const COOKIE_SECRET = "ascynt_super_secret_anti_bypass_2026";
const MIN_GATEWAY_TIME = 12000; // Calibrado para dar un poco más de tiempo de carga realista

// --- CONTADOR DE VISITAS GLOBAL (En memoria) ---
if (!global.totalViews) {
    global.totalViews = 0;
}

// --- BASE DE DATOS DE SCRIPTS / HUB ---
const SCRIPTS_HUB = [
    {
        id: "script-1",
        title: "Murder Mystery 2",
        subtitle: "Easy Ascynthub UI and multi-functions for Low devices",
        details: "Version 1.0 | Anti-Detect | Silent, aimbot, esp, fakelag enemies and more.",
        scriptUrl: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/SkylerUdpss/Ascynthub/refs/heads/main/AscyntHub-mm2.lua"))()'
    },
    {
        id: "script-2",
        title: "Natural Disaster Survival (most popular)",
        subtitle: "Easy Ascynthub UI and multi-functions for Low devices and Free and private scripts",
        details: "Version 1.7 | Multi functions | Telekinesis, fly, vfly, inmortal, and script loaders.",
        scriptUrl: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/SkylerUdpss/Ascynthub/refs/heads/main/AscyntHub-v1.lua"))()'
    },
    {
        id: "script-3",
        title: "Evade",
        subtitle: "Easy UI based with RayxAscynt.",
        details: "Version 1.2 | Multi functions Esp Auto carry and optimized.",
        scriptUrl: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/SkylerUdpss/Ascynthub/refs/heads/main/AscyntHub-evade.lua"))()' 
    },
    {
        id: "script-4",
        title: "UNIVERSAL",
        subtitle: "AscyntHub UI optimizated.",
        details: "Version 1.0 | Multi functions Esp Aimbot silent magnet speed anti rubber and More.",
        scriptUrl: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/SkylerUdpss/Ascynthub/refs/heads/main/AscyntHub-UniversalAim.lua"))()' 
    }
];

// DICCIONARIO DE TRADUCCIONES NATIVAS (Gaming & Clean Terminology)
const LANGUAGES = {
    en: {
        title: "Ascynt Hub | FREE KEY",
        subtitle: "Generate your bypass-proof access key for all Ascynt Hub supported games by completing the steps below.",
        progress: "Your Progress",
        gateways: "Gateways",
        completed: "Completed",
        verification: "Human Verification",
        result: "Enter solution",
        claim: "Claim Free Key",
        success: "Key generated successfully!",
        clickCopy: "Click the box below to copy to clipboard.",
        status: "System Status",
        abnormal: "Abnormal behavior detected. Do not use bypass scripts.",
        sequence: "Sequence error. Please complete checkpoints in order.",
        invalid: "Invalid access state. Please complete all gates.",
        captchaErr: "Verification failed. Incorrect answer.",
        hubTitle: "Available Scripts",
        hubSubtitle: "Explore our collection of free and optimized game scripts.",
        getScript: "Get Script",
        totalViews: "Total Views",
        copiedToast: "COPIED TO CLIPBOARD!",
        selectDays: "Select Key Duration:",
        stepText: "Unlock Checkpoint",
        patchedTitle: "[PATCHED] Free Backdoor Game",
        patchedDesc: "This experience has been patched. Testing requires or exploit serverside simulation is currently disabled."
    },
    es: {
        title: "Ascynt Hub | LLAVE GRATIS",
        subtitle: "Genera tu llave de acceso para todos los juegos de Ascynt Hub completando los siguientes pasos.",
        progress: "Tu Progreso",
        gateways: "Pasos",
        completed: "Completados",
        verification: "Verificación Humana",
        result: "Resultado",
        claim: "Reclamar Llave Gratis",
        success: "¡Llave generada con éxito!",
        clickCopy: "Haz clic en la casilla para copiar la llave.",
        status: "Estado del Sistema",
        abnormal: "Comportamiento anormal detectado. No uses scripts de bypass.",
        sequence: "Error de secuencia. Completa los checkpoints en orden.",
        invalid: "Acceso inválido. Por favor completa los pasos previos.",
        captchaErr: "Verificación fallida. Respuesta incorrecta.",
        hubTitle: "Scripts Disponibles",
        hubSubtitle: "Explora nuestra colección de scripts gratuitos y optimizados.",
        getScript: "Obtener Script",
        totalViews: "Visitas Totales",
        copiedToast: "¡COPIADO EN PORTAPAPELES!",
        selectDays: "Selecciona la Duración de la Llave:",
        stepText: "Desbloquear Paso",
        patchedTitle: "[PARCHEADO] Free Backdoor Game",
        patchedDesc: "Esta experiencia ha sido parcheada. Las pruebas de requires o explotación serverside están desactivadas."
    },
    ru: {
        title: "Ascynt Hub | БЕСПЛАТНЫЙ КЛЮЧ",
        subtitle: "Получите бесплатный ключ для всех игр в Ascynt Hub, пройдя этапы ниже.",
        progress: "Ваш прогресс",
        gateways: "Этапы",
        completed: "Завершено",
        verification: "Проверка человека",
        result: "Ответ",
        claim: "Получить бесплатный ключ",
        success: "Ключ успешно сгенерирован!",
        clickCopy: "Нажмите на поле, чтобы скопировать ключ.",
        status: "Статус системы",
        abnormal: "Обнаружено аномальное поведение. Не используйте скрипты обхода.",
        sequence: "Ошибка последовательности. Пройдите контрольные точки по порядку.",
        invalid: "Неверный доступ. Пожалуйста, завершите все этапы.",
        captchaErr: "Ошибка проверки. Неверный ответ.",
        hubTitle: "Доступные скрипты",
        hubSubtitle: "Изучите нашу коллекцию бесплатных и оптимизированных скриптов.",
        getScript: "Получить скрипт",
        totalViews: "Всего просмотров",
        copiedToast: "СКОПИРОВАНО В БУФЕР!",
        selectDays: "Выберите срок действия ключа:",
        stepText: "Пройти Этап",
        patchedTitle: "[ИСПРАВЛЕНО] Free Backdoor Game",
        patchedDesc: "Это приключение было исправлено. Тестирование скриптов или симуляция серверов в настоящее время отключены."
    },
    ja: {
        title: "Ascynt Hub | 無料キー",
        subtitle: "以下のステップを完了して、Ascynt Hubの全ゲームで使える無料キーを発行します。",
        progress: "進捗状況",
        gateways: "ゲートウェイ",
        completed: "完了",
        verification: "人間による検証",
        result: "答えを入力",
        claim: "無料キーを獲得",
        success: "キーが正常に生成されました！",
        clickCopy: "ボックスをクリックしてクリップボードにコピーします。",
        status: "システムステータス",
        abnormal: "異常な動作を検出しました。バイパスは禁止されています。",
        sequence: "シーケンスエラー。順番にクリアしてください。",
        invalid: "不正なアクセス。すべてのステップを完了してください。",
        captchaErr: "検証に失敗しました。答えが違います。",
        hubTitle: "利用可能なスクリプト",
        hubSubtitle: "最適化された無料スクリプトのコレクションをご覧ください。",
        getScript: "スクリプトを取得",
        totalViews: "総閲覧数",
        copiedToast: "クリップボードにコピーされました！",
        selectDays: "キーの有効期間を選択:",
        stepText: "ステップを解除",
        patchedTitle: "[修正済み] Free Backdoor Game",
        patchedDesc: "このエクスペリエンスは修正されました。バックドアのテストおよびサーバーサイドのエミュレーションは無効化されています。"
    },
    ko: {
        title: "Ascynt Hub | 무료 키",
        subtitle: "아래 단계를 완료하여 Ascynt Hub의 모든 게임에서 사용할 수 있는 무료 키를 생성하세요.",
        progress: "진행률",
        gateways: "단계",
        completed: "완료됨",
        verification: "인간 인증",
        result: "정답 입력",
        claim: "무료 키 받기",
        success: "키가 성공적으로 생성되었습니다!",
        clickCopy: "클립보드에 복사하려면 아래 상자를 클릭하세요.",
        status: "시스템 상태",
        abnormal: "비정상적인 행위 감지. 우회 스크립트를 사용하지 마십시오.",
        sequence: "순서 오류. 체크포인트를 순서대로 완료하세요.",
        invalid: "잘못된 접근. 모든 단계를 완료해 주세요.",
        captchaErr: "인증 실패. 잘못된 정답입니다.",
        hubTitle: "사용 가능한 스크립트",
        hubSubtitle: "최적화된 무료 스크립트 모음을 확인해 보세요.",
        getScript: "스크립트 가져오기",
        totalViews: "총 조회수",
        copiedToast: "클립보드에 복사됨!",
        selectDays: "키 기간 선택:",
        stepText: "단계 잠금 해제",
        patchedTitle: "[패치됨] Free Backdoor Game",
        patchedDesc: "이 디렉토리는 패치되었습니다. 리콰이어 테스트 및 서버사이드 익스플로잇 기능이 중단되었습니다."
    },
    vi: {
        title: "Ascynt Hub | KEY MIỄN PHÍ",
        subtitle: "Tạo key truy cập cho TẤT CẢ trò chơi trong Ascynt Hub bằng cách hoàn thành các bước bên dưới.",
        progress: "Tiến trình",
        gateways: "Cổng",
        completed: "Hoàn thành",
        verification: "Xác minh con người",
        result: "Nhập kết quả",
        claim: "Nhận Key Miễn Phí",
        success: "Tạo Key thành công!",
        clickCopy: "Nhấp vào ô bên dưới để sao chép vào bộ nhớ tạm.",
        status: "Trạng thái",
        abnormal: "Phát hiện hành vi bất thường. Không sử dụng script bypass.",
        sequence: "Lỗi trình tự. Vui lòng hoàn thành các checkpoint theo thứ tự.",
        invalid: "Truy cập không hợp lệ. Vui lòng hoàn thành tất cả các bước.",
        captchaErr: "Xác minh thất bại. Kết quả không chính xác.",
        hubTitle: "Scripts Hiện Có",
        hubSubtitle: "Khám phá bộ sưu tập các script trò chơi miễn phí và tối ưu.",
        getScript: "Lấy Script",
        totalViews: "Tổng Lượt Xem",
        copiedToast: "ĐÃ SAO CHÉP VÀO KHAY NHỚ TẠM!",
        selectDays: "Chọn Thời Gian Key:",
        stepText: "Mở khóa Bước",
        patchedTitle: "[ĐÃ FIX] Free Backdoor Game",
        patchedDesc: "Trải nghiệm ini đã bị vá lỗi. Tính năng test requires hoặc dùng exploit serverside đã bị vô hiệu hóa."
    },
    pl: {
        title: "Ascynt Hub | DARMOWY KLUCZ",
        subtitle: "Wygeneruj swój klucz do wszystkich gier w Ascynt Hub, kończąc poniższe kroki.",
        progress: "Twój Postęp",
        gateways: "Kroki",
        completed: "Ukończono",
        verification: "Weryfikacja człowieka",
        result: "Wynik",
        claim: "Odbierz darmowy klucz",
        success: "Klucz wygenerowany pomyślnie!",
        clickCopy: "Kliknij w pole poniżej, aby skopiować klucz.",
        status: "Status Systemu",
        abnormal: "Wykryto podejrzane zachowanie. Nie używaj skryptów bypassujących.",
        sequence: "Błąd sekwencji. Ukończ punkty kontrolne w odpowiedniej kolejności.",
        invalid: "Nieprawidłowy stan dostępu. Ukończ wszystkie bramki.",
        captchaErr: "Weryfikacja nieudana. Błędny wynik.",
        hubTitle: "Dostępne Skrypty",
        hubSubtitle: "Przeglądaj naszą kolekcji darmowych i zoptymalizowanych skryptów.",
        getScript: "Pobierz Skrypt",
        totalViews: "Wszystkich Wizyt",
        copiedToast: "SKOPIOWANO DO SCHOWKA!",
        selectDays: "Wybierz Czas Trwania Klucza:",
        stepText: "Odblokuj Krok",
        patchedTitle: "[ZAŁATANE] Free Backdoor Game",
        patchedDesc: "Ta funkcja została załatana. Testowanie require oraz exploitów typu serverside jest obecnie wyłączone."
    }
};

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        global.totalViews++;
    }

    const DOCKER_URL = "http://158.23.49.107:24611/api/generate-free-key";
    const SECRET_TOKEN = "generatewithtokenlol";

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Detección automática del lenguaje
    const acceptLang = req.headers['accept-language'] || '';
    let langCode = 'en';
    const supportedLangs = ['es', 'ru', 'ja', 'ko', 'vi', 'pl'];
    for (const lang of supportedLangs) {
        if (acceptLang.toLowerCase().includes(lang)) {
            langCode = lang;
            break;
        }
    }
    const t = LANGUAGES[langCode];

    // Leer cookies de tracking
    const cookiesHeader = req.headers.cookie || '';
    const cookies = {};
    if (cookiesHeader) {
        cookiesHeader.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            if (parts.length === 2) cookies[parts[0].trim()] = parts[1].trim();
        });
    }

    // --- SOLUCIÓN AQUÍ ---
    // Determinamos la duración de los días evaluando query -> cookie -> fallback a 1
    let durationDays = req.query.duration ? parseInt(req.query.duration) : (parseInt(cookies.win_days) || 1);

    // REPARACIÓN ANTI-RESET: Si la cookie se borró pero el usuario ya va en pasos avanzados,
    // forzamos la duración correcta para que no se le resetee a 24h.
    const queryStepCheck = req.query.step ? parseInt(req.query.step) : 0;
    if (queryStepCheck > 4) {
        durationDays = 3; // Los pasos 5 y 6 solo existen en 72h
    } else if (queryStepCheck > 2 && durationDays < 2) {
        durationDays = 2; // Los pasos 3 y 4 solo existen en 48h o 72h (ponemos 2 por defecto)
    }

    if (![1, 2, 3].includes(durationDays)) durationDays = 1;


    // Calcular la cantidad de checkpoints requeridos según los días elegidos
    let maxStepsRequired = 2; 
    if (durationDays === 2) maxStepsRequired = 4;
    if (durationDays === 3) maxStepsRequired = 6;

    // ==============================================================================
    // FIX APLICADO: Guardar la duración explícita en las cookies ANTES del redirect.
    // Esto asegura que al volver de Lootdest (Paso 1) el servidor recuerde la elección.
    // ==============================================================================
    if (req.query.duration || !cookies.win_days) {
        res.setHeader('Set-Cookie', [
            `win_days=${durationDays}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1800`
        ]);
    }

    const savedTimeStr = cookies.win_st1 || '0';
    const savedHash = cookies.win_hash || '';
    let timeStep1 = parseInt(savedTimeStr) || 0;
    
    // Analizar el nivel actual del checkpoint usando verificación criptográfica encadenada
    let currentActualStep = 0;
    if (timeStep1 > 0 && savedHash) {
        for (let s = 1; s <= maxStepsRequired; s++) {
            const checkHash = crypto.createHash('sha256').update(`step${s}-${durationDays}-${timeStep1}-${clientIp}-${COOKIE_SECRET}`).digest('hex');
            if (savedHash === checkHash) {
                currentActualStep = s;
            }
        }
    }

    const queryStep = req.query.step ? parseInt(req.query.step) : 0;
    const ahora = Date.now();

    // Procesamiento dinámico del flujo de Checkpoints
    if (queryStep > 0) {
        if (queryStep === 1) {
            // El paso 1 inicia una nueva firma criptográfica basada en el tiempo usando la duración actual
            const hash1 = crypto.createHash('sha256').update(`step1-${durationDays}-${ahora}-${clientIp}-${COOKIE_SECRET}`).digest('hex');
            res.setHeader('Set-Cookie', [
                `win_st1=${ahora}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1800`,
                `win_hash=${hash1}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1800`,
                `win_days=${durationDays}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1800`
            ]);
            currentActualStep = 1;
            timeStep1 = ahora;
        } 
        else if (queryStep <= maxStepsRequired) {
            // Comprobación de secuencia estricta frente al paso anterior
            if (currentActualStep === queryStep - 1 && timeStep1 > 0) {
                const tiempoTranscurrido = ahora - timeStep1;

                // Validación anti-bypass temporal acumulativa y calibrada
                const tiempoMinimoEsperado = MIN_GATEWAY_TIME * (queryStep - 1);
                if (tiempoTranscurrido < tiempoMinimoEsperado) {
                    res.setHeader('Set-Cookie', [
                        'win_st1=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                        'win_hash=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                        'win_days=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
                    ]);
                    res.setHeader('Content-Type', 'text/html');
                    return res.status(200).send(renderHTML(null, t.abnormal, clientIp, userAgent, 0, durationDays, maxStepsRequired, t));
                }

                // Generar firma criptográfica para el paso actual exitoso
                const hashNext = crypto.createHash('sha256').update(`step${queryStep}-${durationDays}-${timeStep1}-${clientIp}-${COOKIE_SECRET}`).digest('hex');
                res.setHeader('Set-Cookie', [
                    `win_st1=${timeStep1}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1800`,
                    `win_hash=${hashNext}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1800`,
                    `win_days=${durationDays}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1800`
                ]);
                currentActualStep = queryStep;
            } else {
                res.setHeader('Content-Type', 'text/html');
                return res.status(200).send(renderHTML(null, t.sequence, clientIp, userAgent, currentActualStep, durationDays, maxStepsRequired, t));
            }
        }
    }

    let llaveGenerada = null;
    let errorMensaje = null;

    if (req.method === 'POST') {
        try {
            const { captchaAns, captchaUser, clientHwid } = req.body;
            
            if (currentActualStep !== maxStepsRequired) {
                res.setHeader('Content-Type', 'text/html');
                return res.status(200).send(renderHTML(null, t.invalid, clientIp, userAgent, currentActualStep, durationDays, maxStepsRequired, t));
            }

            if (!captchaUser || parseInt(captchaAns) !== parseInt(captchaUser)) {
                res.setHeader('Content-Type', 'text/html');
                return res.status(200).send(renderHTML(null, t.captchaErr, clientIp, userAgent, currentActualStep, durationDays, maxStepsRequired, t));
            }

            const serverGeneratedHwid = crypto.createHash('sha256').update(clientIp + userAgent).digest('hex');
            const finalHwid = clientHwid || serverGeneratedHwid;

            const response = await fetch(DOCKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: SECRET_TOKEN,
                    ip: clientIp,
                    hwid: finalHwid,
                    userAgent: userAgent,
                    key_time: durationDays 
                })
            });

            const data = await response.json();

            if (data.success) {
                llaveGenerada = data.key;
                res.setHeader('Set-Cookie', [
                    'win_st1=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                    'win_hash=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                    'win_days=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
                ]);
            } else {
                errorMensaje = data.message || "Backend authentication error.";
            }
        } catch (error) {
            errorMensaje = "Internal Validation Timeout (500).";
        }
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(renderHTML(llaveGenerada, errorMensaje, clientIp, userAgent, currentActualStep, durationDays, maxStepsRequired, t));
};

function renderHTML(llaveGenerada, errorMensaje, clientIp, userAgent, currentStep, durationDays, maxStepsRequired, t) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const captchaSolucion = num1 + num2;

    const porcentajeProgreso = Math.min(100, Math.max(8, Math.round((currentStep / maxStepsRequired) * 100)));
    let progressText = `${currentStep}/${maxStepsRequired} ${t.gateways}`;
    if (currentStep >= maxStepsRequired) progressText = `${t.completed} (${maxStepsRequired}/${maxStepsRequired})`;

    let siguientePasoIdx = currentStep + 1;
    let urlSiguientePaso = WORKINK_LINKS[`paso${siguientePasoIdx}`] || "#";

    let gatewayButtonHTML = '';
    if (currentStep < maxStepsRequired) {
        let extraBtnClass = siguientePasoIdx % 2 === 0 ? 'step2-btn' : '';
        gatewayButtonHTML = `
            <a href="${urlSiguientePaso}" class="btn action-btn ${extraBtnClass} animated-pulse">
                <span>${t.stepText} ${siguientePasoIdx}</span> <i class="fa-solid fa-angles-right"></i>
            </a>`;
    } else {
        gatewayButtonHTML = `
            <form id="genForm" method="POST" onsubmit="submitForm(event)">
                <div class="form-group">
                    <label class="form-label">${t.verification}</label>
                    <div class="captcha-box">
                        <span class="captcha-math">${num1} + ${num2} =</span>
                        <input type="number" id="captchaUser" class="captcha-input" placeholder="${t.result}" required autocomplete="off">
                    </div>
                </div>
                <input type="hidden" id="captchaAns" value="${captchaSolucion}">
                <input type="hidden" id="clientHwid" value="">
                <button type="submit" class="btn claim-btn">
                    <i class="fa-solid fa-bolt"></i> <span>${t.claim} (${durationDays}d)</span>
                </button>
            </form>`;
    }

    let scriptsHTML = '';
    SCRIPTS_HUB.forEach(script => {
        const base64Script = Buffer.from(script.scriptUrl).toString('base64');
        scriptsHTML += `
            <div class="script-item">
                <div class="script-info">
                    <div class="script-title">${script.title}</div>
                    <div class="script-subtitle">${script.subtitle}</div>
                    <div class="script-details">${script.details}</div>
                </div>
                <button class="btn script-btn" onclick="copyScript(this, '${base64Script}')">
                    <i class="fa-solid fa-code"></i> <span>${t.getScript}</span>
                </button>
            </div>
        `;
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.title}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg: #040406;
                --card-bg: rgba(13, 13, 20, 0.7);
                --border: rgba(255, 255, 255, 0.06);
                --border-hover: rgba(0, 255, 170, 0.3);
                --accent: #00ffaa;
                --accent-rgb: 0, 255, 170;
                --accent-blue: #00e5ff;
                --text: #ffffff;
                --text-muted: #85859e;
                --danger: #ff4a5a;
                --glow: rgba(0, 255, 170, 0.2);
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
            
            body { 
                background: var(--bg); 
                color: var(--text); 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                padding: 40px 24px;
                position: relative;
                overflow-x: hidden;
                gap: 28px;
            }

            body::before {
                content: ''; position: absolute; width: 500px; height: 500px; background: rgba(0, 255, 170, 0.05);
                filter: blur(120px); top: -150px; left: -150px; z-index: -1; animation: floatGlow 10s ease-in-out infinite alternate;
            }
            body::after {
                content: ''; position: absolute; width: 500px; height: 500px; background: rgba(0, 229, 255, 0.05);
                filter: blur(120px); bottom: -150px; right: -150px; z-index: -1; animation: floatGlow 10s ease-in-out infinite alternate-reverse;
            }

            @keyframes floatGlow {
                0% { transform: translate(0, 0) scale(1); }
                100% { transform: translate(40px, 30px) scale(1.1); }
            }

            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); filter: blur(5px); }
                to { opacity: 1; transform: translateY(0); filter: blur(0); }
            }
            
            .navbar { 
                display: flex; gap: 12px; 
                background: rgba(18, 18, 26, 0.5); backdrop-filter: blur(16px);
                padding: 10px 20px; border-radius: 100px; border: 1px solid var(--border); 
                animation: fadeInUp 0.6s ease-out;
            }
            .nav-link { 
                color: var(--text-muted); text-decoration: none; font-size: 13px; font-weight: 600; 
                display: flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 100px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
            }
            .nav-link:hover { color: #fff; background: rgba(255, 255, 255, 0.06); transform: translateY(-1px); }
            
            .card { 
                background: var(--card-bg); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
                padding: 40px; border-radius: 28px; box-shadow: 0 30px 70px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08); 
                text-align: center; max-width: 480px; width: 100%; border: 1px solid var(--border); 
                transition: border 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease;
                animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            .card:hover { 
                border-color: rgba(0, 255, 170, 0.25); 
                transform: translateY(-2px);
                box-shadow: 0 35px 80px rgba(0,0,0,0.8), 0 0 30px rgba(0, 255, 170, 0.03);
            }
            
            .logo-area h2 { font-size: 30px; font-weight: 800; letter-spacing: -1px; margin-bottom: 12px; }
            .logo-area h2 span { background: linear-gradient(135deg, var(--accent), var(--accent-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            
            .subtitle { color: var(--text-muted); font-size: 14px; margin-bottom: 24px; line-height: 1.6; font-weight: 400; }
            
            .duration-selector-wrapper { text-align: left; margin-bottom: 24px; }
            .select-styled {
                width: 100%; padding: 14px 18px; border-radius: 14px; background: rgba(0,0,0,0.3);
                border: 1px solid var(--border); color: #fff; font-size: 14px; font-weight: 600; outline: none;
                cursor: pointer; transition: all 0.3s; appearance: none; -webkit-appearance: none;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2385859e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
                background-repeat: no-repeat; background-position: right 16px center; background-size: 16px;
            }
            .select-styled:focus { border-color: var(--accent-blue); box-shadow: 0 0 15px rgba(0, 229, 255, 0.1); }
            .select-styled:disabled { opacity: 0.65; cursor: not-allowed; }

            .progress-container { margin-bottom: 32px; text-align: left; }
            .progress-label { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;}
            .progress-bar-bg { background: rgba(255,255,255,0.02); height: 8px; border-radius: 100px; width: 100%; overflow: hidden; border: 1px solid rgba(255,255,255,0.01); }
            .progress-bar-fill { background: linear-gradient(90deg, var(--accent), var(--accent-blue)); height: 100%; width: ${porcentajeProgreso}%; border-radius: 100px; box-shadow: 0 0 20px rgba(0,255,170,0.5); transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
            
            .btn { 
                color: #040406; border: none; padding: 16px; width: 100%; border-radius: 16px; font-weight: 700; font-size: 15px; 
                cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); display: flex; justify-content: center; align-items: center; gap: 10px; text-decoration: none; 
            }
            .action-btn { background: #ffffff; box-shadow: 0 4px 20px rgba(255,255,255,0.05); }
            .action-btn:hover { transform: translateY(-3px) scale(1.01); background: #f5f5fa; box-shadow: 0 12px 28px rgba(255,255,255,0.18); }
            .step2-btn { background: linear-gradient(135deg, #00cbff, #0066ff); color: #fff; }
            .step2-btn:hover { box-shadow: 0 12px 28px rgba(0, 102, 255, 0.35); transform: translateY(-3px) scale(1.01); }
            .claim-btn { background: linear-gradient(135deg, var(--accent), #00cc88); text-shadow: 0 1px 1px rgba(0,0,0,0.1); }
            .claim-btn:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 12px 28px var(--glow); }
            
            .form-group { text-align: left; margin-bottom: 24px; }
            .form-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; display: block;}
            .captcha-box { display: flex; gap: 12px; align-items: center; background: rgba(0,0,0,0.25); padding: 14px 20px; border-radius: 14px; border: 1px solid var(--border); transition: all 0.3s; }
            .captcha-box:focus-within { border-color: var(--accent); box-shadow: 0 0 15px rgba(0, 255, 170, 0.08); }
            .captcha-math { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--accent); font-size: 22px; letter-spacing: -0.5px; }
            .captcha-input { background: transparent; border: none; color: #fff; font-size: 18px; width: 100%; text-align: right; outline: none; font-weight: 600; }
            
            .success-badge { color: var(--accent); font-weight: 700; font-size: 16px; margin-bottom: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
            .key-box { 
                background: rgba(0, 255, 170, 0.02); border: 2px dashed rgba(0, 255, 170, 0.25); padding: 22px; border-radius: 16px; 
                font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700; color: var(--accent); letter-spacing: 1px; 
                cursor: pointer; transition: all 0.3s; box-shadow: inset 0 0 20px rgba(0,255,170,0.01);
            }
            .key-box:hover { background: rgba(0, 255, 170, 0.05); border-color: var(--accent); box-shadow: 0 0 25px rgba(0,255,170,0.15); }
            
            .hub-card { text-align: left; }
            .hub-card h3 { font-size: 22px; font-weight: 800; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
            .hub-card h3 i { color: var(--accent); }
            .hub-container { display: flex; flex-direction: column; gap: 16px; margin-top: 20px; }
            .script-item { background: rgba(0, 0, 0, 0.25); border: 1px solid var(--border); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 14px; transition: all 0.3s; }
            .script-item:hover { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.01); transform: translateX(2px); }
            .script-title { font-size: 15px; font-weight: 700; color: #fff; }
            .script-subtitle { font-size: 13px; color: var(--text-muted); line-height: 1.4; margin-top: 2px; }
            .script-details { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent-blue); margin-top: 4px; }
            .script-btn { background: rgba(255, 255, 255, 0.04); color: #fff; border: 1px solid var(--border); padding: 10px; font-size: 13px; border-radius: 12px; height: 44px;}
            .script-btn:hover { background: #fff; color: #040406; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255,255,255,0.1); }

            .featured-section {
                border: 1px solid rgba(255, 74, 90, 0.25);
                background: linear-gradient(145deg, rgba(35, 13, 13, 0.4), rgba(10, 10, 15, 0.8));
            }
            .featured-badge {
                background: rgba(255, 74, 90, 0.15);
                color: var(--danger);
                padding: 4px 10px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                display: inline-block;
                margin-bottom: 8px;
            }

            .telemetry-box { margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border); text-align: left; font-size: 11px; color: var(--text-muted); display: flex; flex-direction: column; gap: 8px; }
            .telemetry-row { display: flex; justify-content: space-between; align-items: center; }
            .telemetry-value { color: #fff; font-family: 'JetBrains Mono', monospace; max-width: 240px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
            .error { color: var(--danger); background: rgba(255, 74, 90, 0.05); padding: 14px; border-radius: 14px; margin-top: 24px; font-size: 13px; border: 1px solid rgba(255, 74, 90, 0.12); font-weight: 600; display: flex; align-items: center; gap: 10px; text-align: left;}
            
            @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0.25); } 100% { box-shadow: 0 0 0 12px rgba(var(--accent-rgb), 0); } }
            .animated-pulse { animation: pulse 2.5s infinite; }
        </style>
    </head>
    <body>
        <nav class="navbar">
            <a href="https://youtube.com/@SkylerModz" target="_blank" class="nav-link"><i class="fab fa-youtube" style="color: #ff0000;"></i> YouTube</a>
            <a href="https://discord.gg/vkNqGQtWg9" target="_blank" class="nav-link"><i class="fab fa-discord" style="color: #5865F2;"></i> Discord</a>
        </nav>

        <div class="card" style="animation-delay: 0.1s;">
            <div class="logo-area">
                <h2>Ascynt<span>Hub</span></h2>
            </div>
            <p class="subtitle">${t.subtitle}</p>
            
            <div class="duration-selector-wrapper">
                <label class="form-label">${t.selectDays}</label>
                <select class="select-styled" id="daysSelector" onchange="changeDuration(this.value)" ${currentStep > 0 ? 'disabled' : ''}>
                    <option value="1" ${durationDays === 1 ? 'selected' : ''}>24 Hours / 1 Day (2 Checkpoints)</option>
                    <option value="2" ${durationDays === 2 ? 'selected' : ''}>48 Hours / 2 Days (4 Checkpoints)</option>
                    <option value="3" ${durationDays === 3 ? 'selected' : ''}>72 Hours / 3 Days (6 Checkpoints)</option>
                </select>
            </div>

            <div class="progress-container">
                <div class="progress-label">
                    <span>${t.progress}</span>
                    <span style="color: var(--accent);">${progressText}</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill"></div>
                </div>
            </div>

            ${!llaveGenerada ? gatewayButtonHTML : `
                <div class="success-badge"><i class="fa-solid fa-circle-check"></i> ${t.success}</div>
                <div class="key-box" onclick="copyKey(this, '${llaveGenerada}')">
                    ${llaveGenerada}
                </div>
                <p style="font-size: 12px; margin-top: 14px; color: var(--text-muted); font-weight: 500;">${t.clickCopy}</p>
            `}

            ${errorMensaje ? `<div class="error"><i class="fa-solid fa-triangle-exclamation"></i> <span>${errorMensaje}</span></div>` : ''}

            <div class="telemetry-box">
                <div class="telemetry-row"><span>${t.status}:</span><span class="telemetry-value" style="color:var(--accent)">Secure Signature Active</span></div>
                <div class="telemetry-row"><span>HWID:</span><span class="telemetry-value" id="hwidDisplay">...</span></div>
                <div class="telemetry-row"><span>${t.totalViews}:</span><span class="telemetry-value" style="color: var(--accent-blue); font-weight: bold;">${global.totalViews}</span></div>
            </div>
        </div>

        <div class="card hub-card featured-section" style="animation-delay: 0.2s;">
            <span class="featured-badge"><i class="fa-solid fa-ban"></i> ${t.patchedTitle}</span>
            <h3>Free Backdoor Game</h3>
            <p style="color: var(--text-muted); font-size: 13px; line-height: 1.5; margin-bottom: 16px;">
                ${t.patchedDesc}
            </p>
            <button class="btn" style="height: 44px; padding: 0 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); color: var(--text-muted); cursor: not-allowed;" disabled>
                <i class="fa-solid fa-lock"></i> <span>Unavailable</span>
            </button>
        </div>

        <div class="card hub-card" style="animation-delay: 0.3s;">
            <h3><i class="fa-solid fa-layer-group"></i> ${t.hubTitle}</h3>
            <p style="color: var(--text-muted); font-size: 13px; line-height: 1.4;">${t.hubSubtitle}</p>
            
            <div class="hub-container">
                ${scriptsHTML}
            </div>
        </div>

        <script>
            const textCopiedToast = "${t.copiedToast}";

            function changeDuration(val) {
                window.location.href = "?duration=" + val;
            }

            function generateBrowserFingerprint() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.textBaseline = "top"; ctx.font = "14px 'Arial'"; ctx.fillStyle = "#f60"; ctx.fillRect(125,1,62,20);
                const canvasData = canvas.toDataURL();
                const screenMetrics = window.screen.width + "x" + window.screen.height;
                const coreComponents = navigator.hardwareConcurrency + "|" + screenMetrics + "|" + canvasData.substring(20, 70);
                return hashString(coreComponents);
            }

            function hashString(str) {
                let hash = 0;
                for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
                return "HWID-" + Math.abs(hash).toString(16).toUpperCase();
            }

            const clientHwid = generateBrowserFingerprint();
            document.getElementById('hwidDisplay').innerText = clientHwid;
            if(document.getElementById('clientHwid')) document.getElementById('clientHwid').value = clientHwid;

            async function submitForm(e) {
                e.preventDefault();
                const bodyData = {
                    captchaAns: document.getElementById('captchaAns').value,
                    captchaUser: document.getElementById('captchaUser').value,
                    clientHwid: clientHwid
                };

                const templateForm = document.createElement('form');
                templateForm.method = 'POST'; templateForm.action = '';
                for (const key in bodyData) {
                    const input = document.createElement('input');
                    input.type = 'hidden'; input.name = key; input.value = bodyData[key];
                    templateForm.appendChild(input);
                }
                document.body.appendChild(templateForm);
                templateForm.submit();
            }

            function copyKey(element, key) {
                navigator.clipboard.writeText(key);
                element.innerText = "COPIED!";
                element.style.borderColor = "#00e5ff";
                element.style.color = "#00e5ff";
                setTimeout(() => { 
                    element.innerHTML = key; 
                    element.style.borderColor = "rgba(0, 255, 170, 0.25)";
                    element.style.color = "var(--accent)";
                }, 1200);
            }

            function copyScript(btn, base64EncodedData) {
                try {
                    const decodedScript = atob(base64EncodedData);
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(decodedScript).then(() => {
                            triggerSuccessAnimation(btn);
                        }).catch(() => {
                            fallbackCopy(btn, decodedScript);
                        });
                    } else {
                        fallbackCopy(btn, decodedScript);
                    }
                } catch(err) {
                    console.error("Copy handler crashed: ", err);
                }
            }

            function fallbackCopy(btn, text) {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed"; 
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    triggerSuccessAnimation(btn);
                } catch (err) {
                    btn.innerHTML = '<i class="fa-solid fa-xmark"></i> <span>Error</span>';
                }
                document.body.removeChild(textArea);
            }

            function triggerSuccessAnimation(btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>' + textCopiedToast + '</span>';
                btn.style.borderColor = "var(--accent)";
                btn.style.color = "var(--accent)";
                btn.style.pointerEvents = "none";
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.borderColor = "var(--border)";
                    btn.style.color = "#fff";
                    btn.style.pointerEvents = "auto";
                }, 1800);
            }
        </script>
    </body>
    </html>
    `;
}
