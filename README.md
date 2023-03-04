# 家庭記帳本

## 介紹

這是一個利用 Express 打造的家庭記帳本網頁，你可以建立自己的帳號建立紀錄。

### 功能描述

- 按類別查詢支出 
- 新增支出
- 修改支出
- 刪除支出

## 環境建置與需求
- [Node.js](https://nodejs.org/en/)
- [Node Package Manager](https://www.npmjs.com/)
- [Express](https://www.npmjs.com/package/express)
- [Express-Handlebars](https://www.npmjs.com/package/express-handlebars)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Mongoose](https://mongoosejs.com/)

## 安裝與執行步驟

1. 開啟終端機(Terminal)，將專案 Clone 到本機電腦

```
git clone
```

2. 進入存放此專案的資料夾

```
cd
```

3. 安裝專案相關套件

```
npm install
```

4. 設定你的 MongoDB 連接

5. 載入種子資料

```
npm run seed
```

6. 啟動伺服器
```
npm run dev
```

當終端機顯示"Express is listening on localhost:3000"，代表啟動成功，你可以在瀏覽器輸入 http://localhost:3000 瀏覽內容。