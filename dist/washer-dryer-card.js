function t(t,e,i,s){var n,r=arguments.length,o=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(o=(r<3?n(o):r>3?n(e,i,o):n(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:h,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,g=f.trustedTypes,m=g?g.emptyScript:"",y=f.reactiveElementPolyfillSupport,_=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!c(t,e),b={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const r=this.constructor;if(!1===s&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??v)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[_("elementProperties")]=new Map,x[_("finalized")]=new Map,y?.({ReactiveElement:x}),(f.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,E=w.trustedTypes,S=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+k,P=`<${M}>`,L=document,O=()=>L.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,T="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,j=/>/g,D=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,I=/"/g,W=/^(?:script|style|textarea|title)$/i,B=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),Z=B(1),q=B(2),V=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),J=new WeakMap,K=L.createTreeWalker(L,129);function Y(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=N;for(let e=0;e<i;e++){const i=t[e];let a,c,h=-1,l=0;for(;l<i.length&&(o.lastIndex=l,c=o.exec(i),null!==c);)l=o.lastIndex,o===N?"!--"===c[1]?o=H:void 0!==c[1]?o=j:void 0!==c[2]?(W.test(c[2])&&(n=RegExp("</"+c[2],"g")),o=D):void 0!==c[3]&&(o=D):o===D?">"===c[0]?(o=n??N,h=-1):void 0===c[1]?h=-2:(h=o.lastIndex-c[2].length,a=c[1],o=void 0===c[3]?D:'"'===c[3]?I:z):o===I||o===z?o=D:o===H||o===j?o=N:(o=D,n=void 0);const d=o===D&&t[e+1].startsWith("/>")?" ":"";r+=o===N?i+P:h>=0?(s.push(a),i.slice(0,h)+C+i.slice(h)+k+d):i+k+(-2===h?e:d)}return[Y(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[c,h]=G(t,e);if(this.el=Q.createElement(c,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=h[r++],i=s.getAttribute(t).split(k),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?st:"?"===o[1]?nt:"@"===o[1]?rt:it}),s.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(W.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],O()),K.nextNode(),a.push({type:2,index:++n});s.append(t[e],O())}}}else if(8===s.nodeType)if(s.data===M)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)a.push({type:7,index:n}),t+=k.length-1}n++}}static createElement(t,e){const i=L.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){if(e===V)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=U(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=X(t,n._$AS(t,e.values),n,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??L).importNode(e,!0);K.currentNode=s;let n=K.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new et(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new ot(n,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(n=K.nextNode(),r++)}return K.currentNode=L,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),U(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new Q(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new et(this.O(O()),this.O(O()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=X(this,t,e,0),r=!U(t)||t!==this._$AH&&t!==V,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=X(this,s[i+o],e,o),a===V&&(a=this._$AH[o]),r||=!U(a)||a!==this._$AH[o],a===F?t=F:t!==F&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class nt extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class rt extends it{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??F)===V)return;const i=this._$AH,s=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(Q,et),(w.litHtmlVersions??=[]).push("3.3.3");const ct=globalThis;let ht=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new et(e.insertBefore(O(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};ht._$litElement$=!0,ht.finalized=!0,ct.litElementHydrateSupport?.({LitElement:ht});const lt=ct.litElementPolyfillSupport;lt?.({LitElement:ht}),(ct.litElementVersions??=[]).push("4.2.2");const dt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:v},ut=(t=pt,e,i)=>{const{kind:s,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ft(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function gt(t){return ft({...t,state:!0,attribute:!1})}const mt=1;class yt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const _t=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends yt{constructor(t){if(super(t),t.type!==mt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return V}});var $t,vt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}($t||($t={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(vt||(vt={}));var bt=function(t,e,i,s){s=s||{},i=i??{};var n=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return n.detail=i,t.dispatchEvent(n),n};const xt={weight_sensing:"wash",pre_wash:"wash",ai_wash:"wash",wash:"wash",cooling:"wash",ai_rinse:"rinse",rinse:"rinse",ai_spin:"spin",spin:"spin",finish:"finish"},wt=["wash","rinse","spin","finish"],At={weight_sensing:"dry",ai_drying:"dry",drying:"dry",sanitizing:"dry",cooling:"cool",finished:"finished",wrinkle_prevent:"finished",air_wash:"finished",refreshing:"finished"},Et=["dry","cool","finished"],St={wash:"Wash",rinse:"Rinse",spin:"Spin",finish:"Done",dry:"Dry",cool:"Cool",finished:"Done"},Ct={wash:"mdi:waves",rinse:"mdi:shower-head",spin:"mdi:fan",finish:"mdi:check-circle",dry:"mdi:heat-wave",cool:"mdi:snowflake",finished:"mdi:check-circle"},kt={run:"Running",off:"Off",idle:"Idle",standby:"Standby",pause:"Paused",delay:"Delay",complete:"Complete",finish:"Complete"};function Mt(t,e){if(!t||!e)return"unavailable";const i=t.states[e];return i?i.state:"unavailable"}function Pt(t,e,i){const s=i?xt:At,n=i?wt:Et,r=Mt(t,e?.entity),o=Mt(t,e?.job_entity),a=Mt(t,e?.completion_entity),c=Mt(t,e?.power_entity),h="unavailable"===r||"unknown"===r,l="run"===r,d=(p=r)&&"unavailable"!==p&&"unknown"!==p?kt[p]||p.charAt(0).toUpperCase()+p.slice(1).replace(/_/g," "):p;var p;const u=s[o],f=u??o,g=n.map(t=>St[t]||t),m=void 0!==u?n.indexOf(u):-1,y=n.length,_=function(t){if(!t||"unavailable"===t||"unknown"===t)return null;const e=new Date(t),i=new Date,s=e.getTime()-i.getTime();if(s<=0)return null;const n=Math.floor(s/6e4),r=Math.floor(n/60),o=n%60;return r>0&&o>0?`${r} hr ${o} min`:r>0?`${r} hr`:o>0?`${o} min`:"< 1 min"}(a);return{state:r,stateLabel:d,isRunning:l,unavailable:h,jobPhase:f,remainingTime:_??"",showRemainingTime:l&&null!==_,power:function(t){if(!t||"unavailable"===t||"unknown"===t)return null;const e=parseFloat(t);return isNaN(e)?t:e>=1e3?`${(e/1e3).toFixed(1)} kW`:`${Math.round(e)} W`}(c),stepIndex:m,totalSteps:y,stepLabels:g}}let Lt=class extends ht{setConfig(t){this._config=t}_valueChanged(t){const e=t.target,i=e.dataset.configValue;if(!i)return;let s=e.value;"number"===e.type&&(s=""===s?void 0:Number(s),void 0!==s&&isNaN(s))||("checkbox"===e.type&&(s=e.checked),this._config&&this._config[i]===s||(this._config={...this._config,[i]:s},bt(this,"config-changed",{config:this._config})))}_machineChanged(t,e,i){const s=this._config?.[t]??{};let n;"entity"===e||"job_entity"===e||"completion_entity"===e||"power_entity"===e?n=i.detail?.value:"hidden"===e?n=!!i.target&&i.target.checked:(n=i.target?i.target.value:"",""===n&&(n=void 0));const r={...s,[e]:n};for(const t of Object.keys(r))void 0===r[t]&&delete r[t];this._config={...this._config,[t]:Object.keys(r).length>0?r:void 0},bt(this,"config-changed",{config:this._config})}_renderMachineSection(t,e,i,s){if(!this.hass)return F;const n=(this._config??{})[t]??{};return Z`
      <div class="section">
        <div class="section-title">${e}</div>

        <label class="toggle">
          <input
            type="checkbox"
            .checked=${n.hidden??!1}
            @change=${e=>this._machineChanged(t,"hidden",e)}
          />
          <span>Hidden</span>
        </label>

        <div class="field">
          <label>Machine State Entity</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${n.entity??""}
            allow-custom-entity
            @value-changed=${e=>this._machineChanged(t,"entity",e)}
          ></ha-entity-picker>
        </div>

        <div class="field">
          <label>Job Phase Entity</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${n.job_entity??""}
            allow-custom-entity
            @value-changed=${e=>this._machineChanged(t,"job_entity",e)}
          ></ha-entity-picker>
        </div>

        <div class="field">
          <label>Completion Time Entity</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${n.completion_entity??""}
            allow-custom-entity
            @value-changed=${e=>this._machineChanged(t,"completion_entity",e)}
          ></ha-entity-picker>
        </div>

        <div class="field">
          <label>Power Sensor Entity (optional)</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${n.power_entity??""}
            allow-custom-entity
            @value-changed=${e=>this._machineChanged(t,"power_entity",e)}
          ></ha-entity-picker>
        </div>

        <div class="field">
          <label>Display Name (optional)</label>
          <input
            type="text"
            class="ha-input"
            placeholder=${s}
            .value=${n.name??""}
            @input=${e=>this._machineChanged(t,"name",e)}
          />
        </div>

        <div class="field">
          <label>Icon (optional)</label>
          <ha-icon-picker
            .hass=${this.hass}
            .value=${n.icon??""}
            .placeholder=${i}
            @value-changed=${e=>this._machineChanged(t,"icon",e)}
          ></ha-icon-picker>
        </div>
      </div>
    `}render(){if(!this.hass)return Z`<div class="loading">Loading…</div>`;const t=this._config??{};return Z`
      <div class="editor">
        <!-- Title -->
        <div class="section">
          <div class="section-title">Card</div>
          <div class="field">
            <label>Title</label>
            <input
              type="text"
              class="ha-input"
              placeholder="Laundry"
              .value=${t.title??""}
              data-config-value="title"
              @input=${this._valueChanged}
            />
          </div>

          <label class="toggle">
            <input
              type="checkbox"
              .checked=${!1!==t.show_progress_bar}
              data-config-value="show_progress_bar"
              @change=${this._valueChanged}
            />
            <span>Show cycle progress bar</span>
          </label>
        </div>

        ${this._renderMachineSection("washer","Washer","mdi:washing-machine","Washing Machine")}
        ${this._renderMachineSection("dryer","Dryer","mdi:tumble-dryer","Dryer")}
      </div>
    `}static get styles(){return o`
      :host {
        display: block;
      }

      .editor {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 8px 0;
      }

      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        color: var(--secondary-text-color);
      }

      .section {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .section-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        margin: 0 0 2px 0;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .field label {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .ha-input {
        width: 100%;
        padding: 8px 12px;
        font-size: 14px;
        font-family: var(--paper-font-body_-_font-family, inherit);
        color: var(--primary-text-color);
        background: var(--secondary-background-color, #f5f5f5);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.15));
        border-radius: 4px;
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.2s;
      }

      .ha-input:focus {
        border-color: var(--primary-color);
      }

      .ha-input::placeholder {
        color: var(--disabled-text-color, #9e9e9e);
      }

      .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .toggle input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary-color);
        cursor: pointer;
      }

      ha-entity-picker,
      ha-icon-picker {
        width: 100%;
      }
    `}};t([ft({attribute:!1})],Lt.prototype,"hass",void 0),t([gt()],Lt.prototype,"_config",void 0),Lt=t([dt("washer-dryer-card-editor")],Lt);let Ot=class extends ht{static getConfigElement(){return document.createElement("washer-dryer-card-editor")}static getStubConfig(){return{type:"custom:washer-dryer-card",title:"Laundry",washer:{},dryer:{},show_progress_bar:!0}}getCardSize(){let t=0;return this._config?.washer&&!this._config.washer.hidden&&t++,this._config?.dryer&&!this._config.dryer.hidden&&t++,this._config?.title&&t++,Math.max(1,2*t)}getGridOptions(){let t=0;this._config?.washer&&!this._config.washer.hidden&&t++,this._config?.dryer&&!this._config.dryer.hidden&&t++;return{rows:Math.max(1,2*t),min_rows:1,max_rows:4,columns:6,min_columns:1,max_columns:12}}setConfig(t){if(!t.washer&&!t.dryer)throw new Error("At least one machine (washer or dryer) must be configured");this._config={...t,show_progress_bar:t.show_progress_bar??!0}}shouldUpdate(){return!!this._config}_openMoreInfo(t){t&&bt(this,"hass-more-info",{entityId:t})}_renderMachine(t,e){if(!t||t.hidden)return F;const i=Pt(this.hass,t,e),s=t.entity,n=(e?wt:Et).map((t,e)=>({label:i.stepLabels[e]||St[t]||t,icon:Ct[t]||""}));let r=i.stateLabel;i.showRemainingTime&&(r=`Running • Finish in ${i.remainingTime}`);const o=_t({"machine-icon":!0,rumble:i.isRunning});return Z`
      <div
        class="machine-panel ${_t({unavailable:i.unavailable})}"
        @click=${()=>this._openMoreInfo(s)}
        @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._openMoreInfo(s))}}
        role="button"
        tabindex="0"
        aria-label=${`${t.name||""} — ${r}`}
      >
        <div class="machine-header">
          <div class="icon-cell">
            <ha-icon class=${o} icon=${t.icon||""}></ha-icon>
          </div>
          <div class="machine-info">
            <div class="machine-name">${t.name||""}</div>
            <div class="machine-status">${r}</div>
          </div>
          ${i.power?Z`<div class="power-badge">${i.power}</div>`:F}
        </div>

        ${!1!==this._config?.show_progress_bar&&(i.stepIndex>=0||i.isRunning)?this._renderPhaseDiagram(n,i.stepIndex,e):F}
      </div>
    `}_renderPhaseDiagram(t,e,i){const s=i?[{d:"M2,2 L85,2 L100,25 L85,48 L2,48 Z",cx:51,tx:0},{d:"M2,2 L85,2 L100,25 L85,48 L2,48 L17,25 Z",cx:134,tx:83},{d:"M2,2 L85,2 L100,25 L85,48 L2,48 L17,25 Z",cx:217,tx:166},{d:"M2,2 L100,2 L100,48 L2,48 L17,25 Z",cx:300,tx:249}]:[{d:"M2,2 L115,2 L130,25 L115,48 L2,48 Z",cx:66,tx:0},{d:"M2,2 L115,2 L130,25 L115,48 L2,48 L17,25 Z",cx:179,tx:113},{d:"M2,2 L125,2 L125,48 L2,48 L17,25 Z",cx:289.5,tx:226}];return q`
      <svg
        viewBox="0 0 355 50"
        preserveAspectRatio="xMidYMid meet"
        style="width: 100%; height: auto; display: block; margin-top: 4px;"
      >
        ${t.map((t,i)=>{const n=i===e,r=n?"var(--primary-color)":"rgba(var(--rgb-primary-color, 3, 169, 244), 0.15)",o=n?"var(--text-primary-color, white)":"var(--primary-color)",{d:a,cx:c,tx:h}=s[i];return q`
            <g>
              <path
                d="${a}"
                transform="translate(${h}, 0)"
                fill="${r}"
                stroke="var(--divider-color)"
                stroke-width="1"
              />
              <foreignObject
                x="${c-10}"
                y="4"
                width="20"
                height="20"
              >
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style="display: flex; align-items: center; justify-content: center; height: 100%;"
                >
                  <ha-icon
                    icon="${t.icon}"
                    style="--mdc-icon-size: 16px; color: ${o};"
                  ></ha-icon>
                </div>
              </foreignObject>
              <text
                x="${c}"
                y="38"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="${o}"
                font-family="sans-serif"
                font-size="13px"
                font-weight="bold"
              >
                ${t.label}
              </text>
            </g>
          `})}
      </svg>
    `}render(){if(!this._config)return F;const t=this._config,e=t.washer&&!t.washer.hidden,i=t.dryer&&!t.dryer.hidden;return e||i?Z`
      <ha-card>
        ${t.title?Z`<div class="card-header">${t.title}</div>`:F}

        <div class="machines">
          ${this._renderMachine(t.washer,!0)}
          ${this._renderMachine(t.dryer,!1)}
        </div>
      </ha-card>
    `:Z`
        <ha-card>
          <div class="empty-state">
            <ha-icon icon="mdi:washing-machine"></ha-icon>
            <p>No machines configured</p>
          </div>
        </ha-card>
      `}static get styles(){return o`
      :host {
        display: block;
      }

      ha-card {
        padding: 0;
        box-sizing: border-box;
        border-radius: var(--ha-card-border-radius, 12px);
      }

      .card-header {
        font-family: var(--paper-font-headline_-_font-family, inherit);
        font-size: 22px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin: 0 0 8px 0;
        padding: 14px 16px 0 16px;
        line-height: 1.2;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 16px;
        color: var(--secondary-text-color);
        gap: 12px;
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        color: var(--disabled-text-color);
      }

      .empty-state p {
        margin: 0;
        font-size: 14px;
        text-align: center;
      }

      .machines {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      /* ─── Machine Panel ─── */

      .machine-panel {
        background: none;
        border: 0;
        border-radius: 0;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.2s, box-shadow 0.2s;
        display: flex;
        flex-direction: column;
        gap: 12px;
        outline: none;
      }

      .machine-panel:not(:first-child) {
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      }

      .machine-panel:focus-visible {
        box-shadow: 0 0 0 2px var(--primary-color);
      }

      .machine-panel:hover {
        background: rgba(255, 255, 255, 0.04);
      }

      .machine-panel.unavailable {
        opacity: 0.55;
      }

      /* ─── Header Row ─── */

      .machine-header {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .icon-cell {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
        border: 2px solid var(--divider-color, rgba(0, 0, 0, 0.1));
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .machine-icon {
        --mdc-icon-size: 24px;
        color: var(--primary-text-color);
      }

      .machine-icon.rumble {
        color: var(--primary-color);
        animation: rumble 0.4s linear infinite;
      }

      @keyframes rumble {
        0% { transform: translate(0px, 0px) rotate(0deg); }
        25% { transform: translate(-1px, 1px) rotate(-1deg); }
        50% { transform: translate(0px, -1px) rotate(0deg); }
        75% { transform: translate(1px, 1px) rotate(1deg); }
        100% { transform: translate(0px, 0px) rotate(0deg); }
      }

      .machine-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .machine-name {
        font-size: 17px;
        font-weight: 600;
        color: var(--primary-text-color);
        line-height: 1.3;
      }

      .machine-status {
        font-size: 13px;
        color: var(--secondary-text-color);
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .power-badge {
        flex-shrink: 0;
        font-size: 12px;
        font-weight: 500;
        color: var(--primary-text-color);
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
        padding: 4px 10px;
        border-radius: 12px;
        white-space: nowrap;
      }

      /* ─── Phase Diagram ─── */

      svg {
        margin-top: 4px;
        display: block;
      }
    `}};t([ft({attribute:!1})],Ot.prototype,"hass",void 0),t([gt()],Ot.prototype,"_config",void 0),Ot=t([dt("washer-dryer-card")],Ot),window.customCards=window.customCards||[],window.customCards.push({type:"washer-dryer-card",name:"Washer Dryer Card",description:"Monitor washer and dryer status with cycle progress tracking",preview:!0}),console.info("%c WASHER-DRYER-CARD %c v1.1.4 ","color: white; background: #1565c0; font-weight: bold;","color: #1565c0; background: white; font-weight: bold;");export{Ot as WasherDryerCard};
