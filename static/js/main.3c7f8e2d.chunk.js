(this.webpackJsonpsozluk=this.webpackJsonpsozluk||[]).push([[0],{25:function(t,e,n){},26:function(t,e,n){},27:function(t,e,n){},34:function(t,e,n){"use strict";n.r(e);var i=n(0),c=n.n(i),a=n(14),s=n.n(a),o=(n(25),n(26),n(15)),r=n(16),d=n(20),u=n(19),l=(n(27),n(2)),h=function(t){Object(d.a)(n,t);var e=Object(u.a)(n);function n(t){var i;return Object(o.a)(this,n),(i=e.call(this,t)).state={definitions:[],word:""},i}return Object(r.a)(n,[{key:"componentDidMount",value:function(){var t=this.props.match.params.word,e=decodeURIComponent(t);this.getDefinition(e)}},{key:"getDefinition",value:function(t){var e=this;(function(t){return fetch("https://sozluk.gov.tr/gts?ara="+t).then((function(t){return t.json()}))})(t).then((function(n){try{e.setState({definitions:n[0].anlamlarListe.map((function(t){return{text:t.anlam}})),word:t.toLowerCase()})}catch(i){e.setState({word:"hata"}),e.getDefinition("hata")}}))}},{key:"render",value:function(){return Object(l.jsx)("div",{className:"word-card-container",children:Object(l.jsxs)("div",{className:"inner-box",children:[Object(l.jsx)("div",{className:"title-container",children:Object(l.jsx)("h3",{className:"word-title",children:this.state.word})}),Object(l.jsx)("div",{className:"definitions",children:this.state.definitions.map((function(t,e){return Object(l.jsxs)("div",{className:"definition-container",children:[Object(l.jsxs)("div",{className:"definition-number",children:[e+1,". "]}),Object(l.jsxs)("div",{className:"definition-text",children:[t.text," "]})]})}))})]})})}}]),n}(c.a.Component),j=n(17),f=n(1);var b=function t(){return Object(l.jsx)("div",{className:"App",children:Object(l.jsxs)(j.a,{children:[Object(l.jsx)(f.a,{path:"/:word/",exact:!0,component:h}),Object(l.jsx)(f.a,{path:"/",exact:!0,component:t})]})})},m=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,35)).then((function(e){var n=e.getCLS,i=e.getFID,c=e.getFCP,a=e.getLCP,s=e.getTTFB;n(t),i(t),c(t),a(t),s(t)}))};s.a.render(Object(l.jsx)(c.a.StrictMode,{children:Object(l.jsx)(b,{})}),document.getElementById("root")),m()}},[[34,1,2]]]);
//# sourceMappingURL=main.3c7f8e2d.chunk.js.map