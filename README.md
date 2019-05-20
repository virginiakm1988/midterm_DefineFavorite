# midterm_DefineFavorite
Users can store their favorite or frequently used website in this app and no longer have to open so many pages in the browser. You can easily define the item's order as you want by just drag and drop it, write some description of the item or delete it. 

## 使用/操作方式
### How to build
1. `git clone https://github.com/a7532ariel/midterm_DefineFavorite.git` 
2. There are two repos in "midterm_DefineFavorite"
3. In one terminal, `cd api` and type `npm install` to install server node module
4. In another terminal,  `cd client` into the client repo and type `npm install` to install client node module
5. `npm start` in both terminals
6. Start definine your own favorite!

### How it works
* localhost:3000/
![](https://i.imgur.com/TMenqKy.png)
* Type
![](https://i.imgur.com/WUHdWra.png)
* Press enter or press submit button to submit
![](https://i.imgur.com/dOAPNd9.png)
![](https://i.imgur.com/e8a4ufa.png)
* You can drag and drop the item as you want!
![](https://i.imgur.com/J1PyOFA.jpg)
![](https://i.imgur.com/4J62LW3.png)
* You can click the 'x' button to delete your item
![](https://i.imgur.com/OkZgXad.png)



## 其他說明
- [x] Define your own Bookmark!
- [x] Delete function
- [x] Draggble and Droppable
- [x] Hover the item to show the description
- [ ] Doubleclick the item to edit the information of the component
- [ ] Classification
- [ ] Upload image


## 使用與參考之框架/模組/原始碼
* [Templated](https://templated.co/) Use one of the templates as the base of the website
* [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd): make component draggable and droppable with React

## 我的貢獻
* build a website whose client-side is in React, server side is in Express, use mongoose to store and Socket.io to communicate 
## 心得
剛開始寫到一半因為要用react-beautiful-dnd實作拖曳功能(跨欄)，需要對應到他的API格式，而大改了儲存state的結構，不過因此後面在實作後端的時候變得較為方便，想清楚前後端彼此之間的互動關係真的很重要

寫js有的時候也會遇到難處，邏輯看似是對的但他就是不會照你想的方式複製、render、setstate等等，需要多方嘗試和上網看有沒有別人已經踩過同樣的雷，promise是個好東西XD

後面code有點越寫越亂，有時間增加新功能前再來修改
