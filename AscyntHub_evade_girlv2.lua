--[[
    Ascynthub - Fixed Premium Edition 2026
    Integrated with Stable External HTTP Login System
    [FIXED SLIDERS, SYNTAX & AUTO-REVIVE SAFE TP]
]]

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")
local LocalPlayer = Players.LocalPlayer
local CoreGui = game:GetService("CoreGui")
local TweenService = game:GetService("TweenService")

local VPS_URL = string.char(104,116,116,112,58,47,47,55,52,46,49,54,50,46,52,49,46,52,50,58,50,52,54,48,57,47,97,112,105,47,118,97,108,105,100,97,116,101,45,107,101,121)
local FreeKeyURL = "https://ascynt-hub-inky.vercel.app"

local url = "https://raw.githubusercontent.com/SkylerUdpss/RayfieldbyAsc/refs/heads/main/source.lua"

local source = game:HttpGet(url)
print("SOURCE LENGTH:", #source)

local fn, err = loadstring(source)

if not fn then
    warn("LOADSTRING ERROR:", err)
    return
end

local success, Rayfield = pcall(fn)

if not success then
    warn("ERROR REAL AL CARGAR RAYFIELD:", Rayfield)
    return
end

print("RAYFIELD TYPE:", typeof(Rayfield), Rayfield)
print("PCALL SUCCESS:", success)

-- Variables globales de control
local playerESPThread
local nextbotESPThread
local tracerThread = nil
local tracerLines = {}
local infiniteSlideEnabled = false
local slideFrictionValue = -8
local slideCharacterConnection

-- Variables para la teletransportación automática
local autoReviveEnabled = false
local isProcessingRevive = false
local safeLocation = nil
local instaReviveEnabled = false

-- === FUNCIÓN DE VALIDACIÓN VÍA VPS ===
local function ValidateKeyWithServer(inputKey)
    if inputKey == "" then return false, "Key not found" end

    local hwid = "UNKNOWN_HWID"
    pcall(function() hwid = game:GetService("RbxAnalyticsService"):GetClientId() end)

    local jsonPayload = HttpService:JSONEncode({key = inputKey, hwid = hwid})
    local success, data = false, nil
    local customRequest = (syn and syn.request) or request or (http and http.request)
    
    if customRequest then
        local reqSuccess, response = pcall(function()
            return customRequest({
                Url = VPS_URL,
                Method = "POST",
                Headers = {["Content-Type"] = "application/json"},
                Body = jsonPayload
            })
        end)
        if reqSuccess and response.StatusCode == 200 then
            local decodeSuccess, decoded = pcall(function() return HttpService:JSONDecode(response.Body) end)
            if decodeSuccess then success = true; data = decoded end
        end
    end

    if not success then
        local httpSuccess, response = pcall(function()
            return HttpService:PostAsync(VPS_URL, jsonPayload, Enum.HttpContentType.ApplicationJson)
        end)
        if httpSuccess then
            local decodeSuccess, decoded = pcall(function() return HttpService:JSONDecode(response) end)
            if decodeSuccess then success = true; data = decoded end
        end
    end

    if success and data then
        return data.success, data
    end
    return false, {message = "api_login_connect_failed_message_error"}
end

-- === INTERFAZ PRINCIPAL DEL JUEGO ===
local function CreateCustomAnnouncement()
    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = "AscynthubAnnouncement"
    ScreenGui.ResetOnSpawn = false
    
    local success, err = pcall(function()
        ScreenGui.Parent = CoreGui
    end)
    if not success then
        ScreenGui.Parent = LocalPlayer:WaitForChild("PlayerGui")
    end

    local MainFrame = Instance.new("Frame")
    MainFrame.Name = "MainFrame"
    MainFrame.Size = UDim2.new(0, 500, 0, 320)
    MainFrame.AnchorPoint = Vector2.new(0.5, 0.5)
    MainFrame.Position = UDim2.new(0.5, 0, 0.5, 0)
    MainFrame.BackgroundColor3 = Color3.fromRGB(20, 20, 25)
    MainFrame.BorderSizePixel = 0
    MainFrame.ClipsDescendants = true
    MainFrame.Parent = ScreenGui

    local Corner = Instance.new("UICorner")
    Corner.CornerRadius = UDim.new(0, 12)
    Corner.Parent = MainFrame

    local Stroke = Instance.new("UIStroke")
    Stroke.Color = Color3.fromRGB(255, 70, 70)
    Stroke.Thickness = 1.5
    Stroke.Parent = MainFrame

    local TitleLabel = Instance.new("TextLabel")
    TitleLabel.Size = UDim2.new(1, 0, 0, 45)
    TitleLabel.BackgroundTransparency = 1
    TitleLabel.Text = "IMPORTANT ANNOUNCEMENT"
    TitleLabel.TextColor3 = Color3.fromRGB(255, 70, 70)
    TitleLabel.Font = Enum.Font.GothamBold
    TitleLabel.TextSize = 18
    TitleLabel.Parent = MainFrame

    local ContentLabel = Instance.new("TextLabel")
    ContentLabel.Size = UDim2.new(0, 460, 0, 190)
    ContentLabel.Position = UDim2.new(0, 20, 0, 55)
    ContentLabel.BackgroundTransparency = 1
    ContentLabel.Text = "Hello to all users who use Ascynthub, whether on NDS or Evade. I want to say that today a staff member or the system deleted both of my scripts, both Evade and Rezero. I am absolutely sure that I followed all the rules, and yet they were removed. I asked for help and they simply told me 'no' in the most indirect way possible. Therefore, if this re-uploaded version disappears, a staff member deleted it. Stay tuned and follow me on YouTube *SkylerModz*\n\n©Ascynthub New HUB for Multi-Games"
    ContentLabel.TextColor3 = Color3.fromRGB(220, 220, 220)
    ContentLabel.Font = Enum.Font.GothamSemibold
    ContentLabel.TextSize = 13
    ContentLabel.TextWrapped = true
    ContentLabel.TextXAlignment = Enum.TextXAlignment.Left
    ContentLabel.TextYAlignment = Enum.TextYAlignment.Top
    ContentLabel.Parent = MainFrame

    local CloseButton = Instance.new("TextButton")
    CloseButton.Size = UDim2.new(0, 150, 0, 35)
    CloseButton.Position = UDim2.new(0.5, -75, 1, -50)
    CloseButton.BackgroundColor3 = Color3.fromRGB(255, 70, 70)
    CloseButton.Text = "I UNDERSTAND"
    CloseButton.TextColor3 = Color3.fromRGB(255, 255, 255)
    CloseButton.Font = Enum.Font.GothamBold
    CloseButton.TextSize = 14
    CloseButton.Parent = MainFrame

    local BtnCorner = Instance.new("UICorner")
    BtnCorner.CornerRadius = UDim.new(0, 6)
    BtnCorner.Parent = CloseButton

    CloseButton.MouseButton1Click:Connect(function()
        TweenService:Create(MainFrame, TweenInfo.new(0.25, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {
            Size = UDim2.new(0, 0, 0, 0),
            BackgroundTransparency = 1
        }):Play()
        task.wait(0.25)
        ScreenGui:Destroy()
    end)
end

-- === INTERFAZ PRINCIPAL DEL JUEGO ===
local function LoadMainScript(keyInfo)
    CreateCustomAnnouncement()

    local Window = Rayfield:CreateWindow({
        Name = "Ascynthub - New",
        LoadingTitle = "Evade Loader...",
        LoadingSubtitle = "Credits: SkylerModzz",
        Theme = "Bloom",
        ShowText = "Ascynthub",
        Icon = 105495960707973,
        ConfigurationSaving = {
            Enabled = true,
            FolderName = "AkuzhubConfig",
            FileName = "EvadeConfig"
        },
        Discord = {
            Enabled = true,
            Invite = "6UaRDjBY42",
            RememberJoins = true
        },
        KeySystem = false
    })

    Rayfield:Notify({
        Name = "¡key sucess!",
        Content = string.format("welcome. Key: %s | Days restant: %s", keyInfo.type or "VIP", tostring(keyInfo.days_left or "N/A")),
        Duration = 5,
        Image = 4483362458,
    })

    local MainTab    = Window:CreateTab("Main")
    local PlayerTab  = Window:CreateTab("Player")
    local VisualsTab = Window:CreateTab("Visuals")
    local MiscTab    = Window:CreateTab("Misc")

    -- 1. ESP Player
    VisualsTab:CreateToggle({
        Name = "ESP Player",
        CurrentValue = false,
        Flag = "EspPlayer",
        Callback = function(state)
            local function getDistance(pos)
                local char = LocalPlayer.Character
                local hrp = char and char:FindFirstChild("HumanoidRootPart")
                return hrp and (pos - hrp.Position).Magnitude or nil
            end

            local function createPlayerESP(part)
                local billboard = Instance.new("BillboardGui")
                billboard.Name = "PlayerESP"
                billboard.Adornee = part
                billboard.Size = UDim2.new(0, 180, 0, 25)
                billboard.StudsOffset = Vector3.new(0, 3.2, 0)
                billboard.AlwaysOnTop = true
                billboard.LightInfluence = 0
                billboard.Parent = part

                local label = Instance.new("TextLabel")
                label.Name = "Label"
                label.Size = UDim2.new(1, 0, 1, 0)
                label.BackgroundTransparency = 1
                label.TextStrokeTransparency = 0.25
                label.TextScaled = true
                label.RichText = true
                label.Font = Enum.Font.GothamSemibold
                label.Text = ""
                label.TextColor3 = Color3.fromRGB(100, 180, 255)
                label.Parent = billboard

                return label
            end

            local function removeAllESPs()
                local folder = workspace:FindFirstChild("Game") and workspace.Game:FindFirstChild("Players")
                if folder then
                    for _, char in ipairs(folder:GetChildren()) do
                        if char:IsA("Model") then
                            local hrp = char:FindFirstChild("HumanoidRootPart")
                            if hrp then
                                local existing = hrp:FindFirstChild("PlayerESP")
                                if existing then existing:Destroy() end
                            end
                        end
                    end
                end
            end

            if state then
                if playerESPThread and coroutine.status(playerESPThread) == "suspended" then
                    coroutine.close(playerESPThread)
                end
                playerESPThread = coroutine.create(function()
                    while true do
                        local folder = workspace:FindFirstChild("Game") and workspace.Game:FindFirstChild("Players")
                        if folder then
                            for _, char in ipairs(folder:GetChildren()) do
                                if char:IsA("Model") then
                                    local team = char:GetAttribute("Team")
                                    if team ~= "Nextbot" and char.Name ~= LocalPlayer.Name then
                                        local hrp = char:FindFirstChild("HumanoidRootPart")
                                        if hrp then
                                            local espGui = hrp:FindFirstChild("PlayerESP") or createPlayerESP(hrp).Parent
                                            local label = espGui and espGui:FindFirstChild("Label")
                                            if label then
                                                local dist = getDistance(hrp.Position) or 0
                                                local downed = char:GetAttribute("Downed")
                                                local downedTime = tonumber(char:GetAttribute("DownedTimeLeft")) or 0
                                                local name = char.Name

                                                local displayText, color
                                                if downed == true then
                                                    color = Color3.fromRGB(255, 120, 120)
                                                    displayText = name .. " (Downed " .. string.format("%.0f", downedTime) .. ")"
                                                else
                                                    color = Color3.fromRGB(120, 255, 120)
                                                    displayText = name .. "\n" .. string.format("%.0f", dist) .. " studs"
                                                end
                                                label.Text = displayText
                                                label.TextColor3 = color
                                            end
                                        end
                                    end
                                end
                            end
                        end
                        task.wait(0.5)
                    end
                end)
                coroutine.resume(playerESPThread)
            else
                removeAllESPs()
                if playerESPThread and (coroutine.status(playerESPThread) == "suspended" or coroutine.status(playerESPThread) == "running") then
                    pcall(coroutine.close, playerESPThread)
                    playerESPThread = nil
                end
            end
        end
    })

    -- 2. ESP Nextbot
    VisualsTab:CreateToggle({
        Name = "ESP Nextbot",
        CurrentValue = false,
        Flag = "EspNextbot",
        Callback = function(state)
            local function getDistance(pos)
                local char = LocalPlayer.Character
                local hrp = char and char:FindFirstChild("HumanoidRootPart")
                return hrp and (pos - hrp.Position).Magnitude or nil
            end
            local function getESPPart(obj)
                if obj:IsA("BasePart") then return obj
                elseif obj:IsA("Model") then
                    return obj:FindFirstChild("Root") or obj:FindFirstChild("Head") or obj:FindFirstChild("HumanoidRootPart") or obj:FindFirstChildWhichIsA("BasePart")
                end
                return nil
            end
            local function getColorByDistance(dist)
                if dist <= 12 then return Color3.fromRGB(50, 50, 50)
                elseif dist <= 60 then
                    local t = (dist - 6) / 14
                    return Color3.fromRGB(255, 120 + (255 - 120) * t, 120)
                else return Color3.fromRGB(200, 150, 255)
                end
            end
            local function createESP(part)
                local billboard = Instance.new("BillboardGui")
                billboard.Name = "NextbotESP"
                billboard.Adornee = part
                billboard.Size = UDim2.new(0, 180, 0, 25)
                billboard.StudsOffset = Vector3.new(0, 3.2, 0)
                billboard.AlwaysOnTop = true
                billboard.LightInfluence = 0
                billboard.Parent = part

                local label = Instance.new("TextLabel")
                label.Name = "Label"
                label.Size = UDim2.new(1, 0, 1, 0)
                label.BackgroundTransparency = 1
                label.TextStrokeTransparency = 0.25
                label.TextScaled = true
                label.Font = Enum.Font.GothamSemibold
                label.Text = ""
                label.TextColor3 = Color3.fromRGB(255, 255, 255)
                label.Parent = billboard

                return billboard
            end
            local function removeAllNextbotESP()
                local folder = workspace:FindFirstChild("Game") and workspace.Game:FindFirstChild("Players")
                if folder then
                    for _, npc in ipairs(folder:GetChildren()) do
                        local part = getESPPart(npc)
                        if part then
                            local existing = part:FindFirstChild("NextbotESP")
                            if existing then existing:Destroy() end
                        end
                    end
                end
            end
            if state then
                if nextbotESPThread and coroutine.status(nextbotESPThread) == "suspended" then
                    coroutine.close(nextbotESPThread)
                end
                nextbotESPThread = coroutine.create(function()
                    while true do
                        local folder = workspace:FindFirstChild("Game") and workspace.Game:FindFirstChild("Players")
                        if folder then
                            for _, npc in ipairs(folder:GetChildren()) do
                                if npc:GetAttribute("Team") == "Nextbot" then
                                    local part = getESPPart(npc)
                                    if part then
                                        local billboard = part:FindFirstChild("NextbotESP") or createESP(part)
                                        local label = billboard and billboard:FindFirstChild("Label")
                                        if label then
                                            local dist = getDistance(part.Position)
                                            if dist then
                                                label.Text = string.format("%s\n%.0f studs", npc.Name, dist)
                                                label.TextColor3 = getColorByDistance(dist)
                                            else
                                                label.Text = npc.Name
                                                label.TextColor3 = Color3.fromRGB(255, 255, 255)
                                            end
                                        end
                                    end
                                end
                            end
                        end
                        task.wait(0.5)
                    end
                end)
                coroutine.resume(nextbotESPThread)
            else
                removeAllNextbotESP()
                if nextbotESPThread and (coroutine.status(nextbotESPThread) == "suspended" or coroutine.status(nextbotESPThread) == "running") then
                    pcall(coroutine.close, nextbotESPThread)
                    nextbotESPThread = nil
                end
            end
        end
    })

    -- 3. Tracer Downed Players
    VisualsTab:CreateToggle({
        Name = "Tracer Downed Players",
        CurrentValue = false,
        Flag = "TracerDowned",
        Callback = function(state)
            local Camera = workspace.CurrentCamera
            local function cleanup()
                for _, line in ipairs(tracerLines) do line.Visible = false end
            end

            if state then
                if tracerThread and coroutine.status(tracerThread) == "suspended" then
                    coroutine.close(tracerThread)
                end
                tracerThread = coroutine.create(function()
                    local lineIndex = 1
                    while true do
                        cleanup()
                        lineIndex = 1
                        local folder = workspace:FindFirstChild("Game") and workspace.Game:FindFirstChild("Players")
                        if folder then
                            for _, char in ipairs(folder:GetChildren()) do
                                if char:IsA("Model") then
                                    local team = char:GetAttribute("Team")
                                    local downed = char:GetAttribute("Downed")
                                    if team ~= "Nextbot" and char.Name ~= LocalPlayer.Name and downed == true then
                                        local hrp = char:FindFirstChild("HumanoidRootPart")
                                        if hrp and Camera then
                                            local pos, onScreen = Camera:WorldToViewportPoint(hrp.Position)
                                            if onScreen then
                                                local tracer = tracerLines[lineIndex]
                                                if not tracer then
                                                    tracer = Drawing.new("Line")
                                                    tracer.Color = Color3.fromRGB(255, 120, 120)
                                                    tracer.Thickness = 2
                                                    tracer.ZIndex = 1
                                                    table.insert(tracerLines, tracer)
                                                end
                                                tracer.From = Vector2.new(Camera.ViewportSize.X / 2, Camera.ViewportSize.Y)
                                                tracer.To = Vector2.new(pos.X, pos.Y)
                                                tracer.Visible = true
                                                lineIndex = lineIndex + 1
                                            end
                                        end
                                    end
                                end
                            end
                        end
                        task.wait(0.03)
                    end
                end)
                coroutine.resume(tracerThread)
            else
                if tracerThread and (coroutine.status(tracerThread) == "suspended" or coroutine.status(tracerThread) == "running") then
                    pcall(coroutine.close, tracerThread)
                    tracerThread = nil
                end
                for _, line in ipairs(tracerLines) do line:Remove() end
                tracerLines = {}
            end
        end
    })

    -- 4. Speed / JumpCap sliders
    local currentSettings = { Speed = 1500, JumpCap = 1 }
    local requiredFields = {
        Friction=true, AirStrafeAcceleration=true, JumpHeight=true, RunDeaccel=true,
        JumpSpeedMultiplier=true, JumpCap=true, SprintCap=true, WalkSpeedMultiplier=true,
        BhopEnabled=true, Speed=true, AirAcceleration=true, RunAccel=true, SprintAcceleration=true
    }

    local cachedGameTables = nil
    local lastTableScan = 0

    local function getMatchingTables()
        if cachedGameTables and (tick() - lastTableScan) < 5 then
            return cachedGameTables
        end
        
        local matched = {}
        for _, obj in pairs(getgc(true)) do
            if typeof(obj) == "table" then
                local ok = true
                for field in pairs(requiredFields) do
                    if rawget(obj, field) == nil then ok = false; break end
                end
                if ok then table.insert(matched, obj) end
            end
        end
        
        cachedGameTables = matched
        lastTableScan = tick()
        return matched
    end

    local function applyToTables(callback)
        for _, tableObj in ipairs(getMatchingTables()) do
            if typeof(tableObj) == "table" then pcall(callback, tableObj) end
        end
    end

    local lastSpeedTick = 0
    PlayerTab:CreateSlider({
        Name = "Set Speed",
        Range = {1450, 12500},
        Increment = 50,
        Suffix = "",
        CurrentValue = 1500,
        Flag = "SpeedSlider",
        Callback = function(val)
            currentSettings.Speed = val
            local currentTick = tick()
            if (currentTick - lastSpeedTick) >= 0.15 then
                lastSpeedTick = currentTick
                task.spawn(function()
                    applyToTables(function(obj) obj.Speed = val end)
                end)
            end
        end
    })

    local lastJumpTick = 0
    PlayerTab:CreateSlider({
        Name = "Set Jump Cap",
        Range = {1, 5000},
        Increment = 10,
        Suffix = "",
        CurrentValue = 1,
        Flag = "JumpCapSlider",
        Callback = function(val)
            currentSettings.JumpCap = val
            local currentTick = tick()
            if (currentTick - lastJumpTick) >= 0.15 then
                lastJumpTick = currentTick
                task.spawn(function()
                    applyToTables(function(obj) obj.JumpCap = val end)
                end)
            end
        end
    })

    -- 5. Infinite Slide
    MainTab:CreateToggle({
        Name = "Infinite Slide",
        CurrentValue = false,
        Flag = "InfiniteSlideToggle",
        Callback = function(state)
            infiniteSlideEnabled = state
            local cachedTables
            local plrModel
            local slideConnection
            local keys = {
                "Friction","AirStrafeAcceleration","JumpHeight","RunDeaccel",
                "JumpSpeedMultiplier","JumpCap","SprintCap","WalkSpeedMultiplier",
                "BhopEnabled","Speed","AirAcceleration","RunAccel","SprintAcceleration"
            }
            local function hasAll(tbl)
                if type(tbl) ~= "table" then return false end
                for _, k in ipairs(keys) do if rawget(tbl, k) == nil then return false end end
                return true
            end
            local function setFriction(value)
                if not cachedTables then return end
                for _, t in ipairs(cachedTables) do t.Friction = value end
            end
            local function updatePlayerModel()
                local GameFolder = workspace:FindFirstChild("Game")
                local PlayersFolder = GameFolder and GameFolder:FindFirstChild("Players")
                if PlayersFolder then plrModel = PlayersFolder:FindFirstChild(Players.LocalPlayer.Name) else plrModel = nil end
            end
            local function onHeartbeat()
                if not plrModel then setFriction(5); return end
                local currentState = plrModel:GetAttribute("State")
                if currentState then
                    if currentState == "Slide" then
                        plrModel:SetAttribute("State", "EmotingSlide")
                    elseif currentState == "EmotingSlide" then
                        setFriction(slideFrictionValue)
                    else setFriction(5) end
                else setFriction(5) end
            end
            if state then
                cachedTables = {}
                for _, obj in ipairs(getgc(true)) do
                    if hasAll(obj) then table.insert(cachedTables, obj) end
                end
                updatePlayerModel()
                slideConnection = game:GetService("RunService").Heartbeat:Connect(onHeartbeat)
                slideCharacterConnection = Players.LocalPlayer.CharacterAdded:Connect(function() task.wait(0.1); updatePlayerModel() end)
            else
                cachedTables = nil; plrModel = nil
                if slideConnection then slideConnection:Disconnect(); slideConnection = nil end
                if slideCharacterConnection then slideCharacterConnection:Disconnect(); slideCharacterConnection = nil end
                setFriction(5)
            end
        end
    })

    MainTab:CreateSlider({
        Name = "Infinite Slide Speed",
        Range = {-500, -1},
        Increment = 1,
        Suffix = "",
        CurrentValue = -8,
        Flag = "SlideSpeedSlider",
        Callback = function(val)
            slideFrictionValue = val
        end
    })

    -- 6. Auto Carry Tradicional
    getgenv().autoCarryEnabled = false
    MainTab:CreateToggle({
        Name = "Auto Carry (Close Range)",
        CurrentValue = false,
        Flag = "AutoCarry",
        Callback = function(state)
            getgenv().autoCarryEnabled = state
        end
    })

    -- 7. NUEVO: Auto Teleport & Carry Downed Safe Mode
    MainTab:CreateToggle({
        Name = "Auto Revive Others (Instant)",
        CurrentValue = false,
        Flag = "InstaRevive",
        Callback = function(state)
            instaReviveEnabled = state
        end
    })
    
    MainTab:CreateToggle({
        Name = "Auto TP & Safe Carry (Reviver)",
        CurrentValue = false,
        Flag = "AutoSafeRevive",
        Callback = function(state)
            autoReviveEnabled = state
            if not state then isProcessingRevive = false end
        end
    })

    -- PESTAÑA EXTRA: MISC
    MiscTab:CreateButton({
        Name = "Load Infinite Yield",
        Callback = function()
            pcall(function()
                loadstring(game:HttpGet("https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source"))()
            end)
        end
    })

    MiscTab:CreateLabel("AscyntHub - API Verificator Operational")
end

-- === VENTANA DE VERIFICACIÓN / LOGIN INICIAL ===
local LoginWindow = Rayfield:CreateWindow({
    Name = "Ascynthub | Gateway Security",
    LoadingTitle = "Checking Gateway...",
    LoadingSubtitle = "By SkylerModzz",
    Theme = "Light",
    ShowText = "Verification Required",
    Icon = 105495960707973,
    KeySystem = false
})

local LoginTab = LoginWindow:CreateTab("License Activation")
LoginTab:CreateLabel("Please enter your Key to log in to the Hub.")

local InputKeyString = ""
LoginTab:CreateInput({
    Name = "Enter License Key",
    PlaceholderText = "Paste key...",
    RemoveTextAfterFocusLost = false,
    Callback = function(Text)
        InputKeyString = Text
    end
})

LoginTab:CreateButton({
    Name = "Verify & Login",
    Callback = function()
        if InputKeyString == "" then
            Rayfield:Notify({
                Title = "Error",
                Content = "¡Key is empty!",
                Duration = 4,
                Image = 4483362458,
            })
            return
        end

        local isSuccess, serverData = ValidateKeyWithServer(InputKeyString)

        if isSuccess then
            task.spawn(function()
                LoadMainScript(serverData)
            end)
            
            task.wait(0.1)
            LoginWindow:Destroy()
        else
            local errorMsg = (serverData and serverData.message) or "Invalid or expired key."
            Rayfield:Notify({
                Title = "Activation Failed",
                Content = errorMsg,
                Duration = 5,
                Image = 4483362458,
            })
        end
    end
})

LoginTab:CreateButton({
    Name = "Get Free Key (Copy Link)",
    Callback = function()
        if setclipboard then 
            setclipboard(FreeKeyURL) 
        elseif toclipboard then 
            toclipboard(FreeKeyURL) 
        end
        Rayfield:Notify({
            Title = "Enlace Copiado",
            Content = "The key system link was saved to your clipboard.",
            Duration = 4,
            Image = 4483362458,
        })
    end
})

-- === HILOS DE CONFIGURACIÓN Y PROCESAMIENTO EN SEGUNDO PLANO ===

local function GetDynamicSafeZone()
    local map = Workspace:FindFirstChild("Map") or Workspace:FindFirstChild("MapFolder")
    if map then
        local parts = {}
        for _, obj in ipairs(map:GetDescendants()) do
            if obj:IsA("BasePart") and obj.Size.X > 15 and obj.Size.Z > 15 and obj.CanCollide == true then
                table.insert(parts, obj)
            end
        end
        if #parts > 0 then
            -- Tomamos una pieza grande céntrica del mapa para asegurar piso firme y no vacío vacío.
            local targetPart = parts[math.random(1, #parts)]
            return targetPart.Position + Vector3.new(0, 4, 0)
        end
    end
    -- Fallback si el mapa no se indexa de forma convencional
    return Vector3.new(0, 10, 0)
end

-- Loop Secundario de Control Automatizado (Auto Carry, Instant y Teleport Safe)
task.spawn(function()
    while true do
        local char = LocalPlayer.Character
        local hrp = char and char:FindFirstChild("HumanoidRootPart")

        if hrp then
            -- 1. Gestión del Instant Revive (Usando el método indexado correcto)
            if instaReviveEnabled then
                local folder = Workspace:FindFirstChild("Game") and Workspace.Game:FindFirstChild("Players")
                if folder then
                    for _, otherChar in ipairs(folder:GetChildren()) do
                        if otherChar:IsA("Model") and otherChar.Name ~= LocalPlayer.Name and otherChar:GetAttribute("Downed") == true then
                            local oHrp = otherChar:FindFirstChild("HumanoidRootPart")
                            if oHrp and (hrp.Position - oHrp.Position).Magnitude <= 15 then
                                local args = { "Carry", [3] = otherChar.Name }
                                pcall(function()
                                    local ev = game:GetService("ReplicatedStorage"):FindFirstChild("Events")
                                    local interact = ev and ev:FindFirstChild("Character") and ev.Character:FindFirstChild("Interact")
                                    if interact then interact:FireServer(unpack(args)) end
                                end)
                            end
                        end
                    end
                end
            end

            -- 2. Gestión del Auto TP Inteligente a Derribados
            if autoReviveEnabled and not isProcessingRevive then
                local folder = Workspace:FindFirstChild("Game") and Workspace.Game:FindFirstChild("Players")
                if folder then
                    for _, otherChar in ipairs(folder:GetChildren()) do
                        if otherChar:IsA("Model") and otherChar.Name ~= LocalPlayer.Name then
                            local isDowned = otherChar:GetAttribute("Downed")
                            local otherHrp = otherChar:FindFirstChild("HumanoidRootPart")
                            
                            if isDowned == true and otherHrp then
                                isProcessingRevive = true
                                safeLocation = GetDynamicSafeZone()
                                
                                -- Teletransporte exacto al jugador derribado
                                hrp.CFrame = otherHrp.CFrame + Vector3.new(0, 2, 0)
                                task.wait(0.3)
                                
                                -- Intentar levantarlo / cargarlo (Carry) usando la tabla indexada funcional
                                local args = { "Carry", [3] = otherChar.Name }
                                pcall(function()
                                    local events = game:GetService("ReplicatedStorage"):FindFirstChild("Events")
                                    local interact = events and events:FindFirstChild("Character") and events.Character:FindFirstChild("Interact")
                                    if interact then interact:FireServer(unpack(args)) end
                                end)
                                
                                task.wait(0.4) -- Espera de sincronización
                                
                                -- Teletransporte a la zona segura calculada sobre el mapa
                                hrp.CFrame = CFrame.new(safeLocation)
                                
                                task.wait(3.5) -- Tiempo estimado para revivirlo con seguridad en la zona
                                isProcessingRevive = false
                                break
                            end
                        end
                    end
                end
            end

            -- 3. Gestión del Auto Carry Clásico de Corto Alcance
            if getgenv().autoCarryEnabled and not isProcessingRevive then
                for _, other in ipairs(Players:GetPlayers()) do
                    if other ~= LocalPlayer and other.Character and other.Character:FindFirstChild("HumanoidRootPart") then
                        local dist = (hrp.Position - other.Character.HumanoidRootPart.Position).Magnitude
                        if dist <= 21 then
                            local args = { "Carry", [3] = other.Name }
                            pcall(function()
                                local events = game:GetService("ReplicatedStorage"):FindFirstChild("Events")
                                local interact = events and events:FindFirstChild("Character") and events.Character:FindFirstChild("Interact")
                                if interact then interact:FireServer(unpack(args)) end
                            end)
                            task.wait(0.05)
                        end
                    end
                end
            end
        end
        task.wait(0.1)
    end
end)
