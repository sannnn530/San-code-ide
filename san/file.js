// 🗄️ Initial Virtual Project Directory Context
const initialWorkspace = {
    "src/main.luau": `-- 🚀 Roblox Script Executor Layer
local Rayfield = loadstring(game:HttpGet('https://sirius.menu/rayfield'))()

local Window = Rayfield:CreateWindow({
   Name = "San Script Hub V65",
   LoadingTitle = "Injected Frame Assets...",
   LoadingSubtitle = "by Sun",
   ConfigurationSaving = { Enabled = false }
})

local Tab = Window:CreateTab("Automation", 4483362458)

local Button = Tab:CreateButton({
   Name = "Farm Honey (Bee Swarm)",
   Callback = function()
       print("Starting automation routine...")
       -- ERROR TRIGGER AREA: Missing thread yield loop
   end,
})`,

    "src/gateway.js": `// 🔒 Security Verification Gateway
function verifyUserToken(urlParam) {
    const key = atob(urlParam); // Decode Base64 data
    if (key === "Access_Granted_M1") {
        console.log("Validation Successful.");
        return true;
    }
    return false;
}`,

    "index.html": `<!DOCTYPE html>
<html>
<head>
    <title>San Script Hub Gateway Page</title>
</head>
<body>
    <h1>System Status: Operating Nominal</h1>
</body>
</html>`
};
