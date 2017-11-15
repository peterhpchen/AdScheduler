# Introdution

這是一個用來產生廣告檔次的報表的終端互動程式, 產生如`example/report.xlsx`的報表.

# Console Interactive App
終端互動的功能是仰賴`inquirer`來完成, 應用會提出許多問題, 依照問題來引導使用者完成產出報表的相關資訊.

問題描述可以參考`./assets/QuestionDiagram.xml`(使用draw.io開啟)

由`index.js`取得要問的問題(`lib/inquirer/question.js`), 每個問題會有選項(`choice.js`)及驗證方式(`validator.js`), 取回來後由主程式(`index.js`)判斷是否有其他問題.

# Scheduler 

填完問題後, 進入產生報表的流程, 這時取得的資料是還未整理過的問題答案資料, 因此要給scheduler一個arranger來取得我們要輸出的資料, 之後就使用exporter來產出excel報表, scheduler採用DI的方式注入arranger跟exporter, 未來如果不是用console或是要輸出別的格式的報表都可以抽換.

報表的部分採用xlsx-template以固定範本的方式匯出, 第一頁因為有廣告名稱要輸出, 所以會跟第二頁以後的範本不同.

輸出的報表會依照templateConfig.js上設定的路徑存放.
# Install

安裝應用需要的相關元件
> npm install

如果輸出報表發生錯誤(頁面資料亂跳), 請將./node_modules/xlsx-template/lib/index.js: 120-121替換成下面的程式碼
```js
if ((index1 + index2) == 0) {
    if(rel1.attrib.Id && rel2.attrib.Id) return rel1.attrib.Id.substring(3) - rel2.attrib.Id.substring(3);
    return rel1._id - rel2._id;
}
```

# Run

執行index.js
> node index.js
