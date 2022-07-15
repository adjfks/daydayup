```css
.container {
    display: flex;
    flex-direction: column;
    .header {
        height: 75px;
    }

    .main {
        flex: 1;    // 相当于flex: 1 1 0; flex-basis默认值为0，表现为设置的height或max-content
        height: 0;    // 必须加上height: 0 , 否则表现为设置的height或max-content
    }

    .footer {
        height: 90px;
    }
}
```


