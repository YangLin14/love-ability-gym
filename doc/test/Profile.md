---
description: Profile 頁面測試案例
---

> 狀態：初始為 [ ]、完成為 [x]
> 注意：狀態只能在測試通過後由流程更新。
> 測試類型：前端元素、function 邏輯、Mock API、驗證權限...

---

## [] 【前端元素】渲染基本元素
**範例輸入**：載入 Profile 頁面（無歷史資料）
**期待輸出**：
- 顯示標題 "Profile & History"
- 顯示返回按鈕 "←"
- 顯示使用者頭像、名稱、等級
- 顯示 "Day Streak" 和 "Activities" 統計區塊
- 顯示 "No training history yet. Go to the Gym!" 訊息

---

## [] 【前端元素】顯示 Profile 卡片（預設資料）
**範例輸入**：userProfile: { name: 'User', avatar: '😊', age: '' }
**期待輸出**：
- 顯示頭像 "😊"
- 顯示名稱 "User"
- 顯示 "Lv. 1"
- 顯示 "0 XP"

---

## [] 【功能邏輯】進入編輯模式
**範例輸入**：點擊頭像區域
**期待輸出**：
- 顯示 Avatar、Name、Age 輸入欄位
- 顯示 "Save Changes" 按鈕

---

## [] 【功能邏輯】編輯 Profile 並儲存
**範例輸入**：修改 Name 為 "TestUser"，點擊 "Save Changes"
**期待輸出**：
- 返回顯示模式
- 顯示 "TestUser"

---

## [] 【功能邏輯】重置資料按鈕存在
**範例輸入**：載入 Profile 頁面
**期待輸出**：
- 顯示 "Reset All Data" 按鈕

---

## [] 【導航】返回按鈕
**範例輸入**：點擊 "←" 按鈕
**期待輸出**：
- 導航至首頁 "/"
