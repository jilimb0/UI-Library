import{i as e}from"./preload-helper-DbRxMUml.js";import{t}from"./jsx-runtime-CuZwk2YS.js";var n,r,i,a,o;e((()=>{n=t(),r={title:`Design System/Spacing`},i=[{label:`space-1`,value:4},{label:`space-2`,value:8},{label:`space-3`,value:12},{label:`space-4`,value:16},{label:`space-6`,value:24},{label:`space-8`,value:32},{label:`space-12`,value:48},{label:`space-16`,value:64}],a=()=>(0,n.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,fontFamily:`sans-serif`},children:i.map(({label:e,value:t})=>(0,n.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,n.jsx)(`span`,{style:{width:80,fontSize:12,color:`#6b7280`},children:e}),(0,n.jsx)(`div`,{style:{height:24,width:t,background:`#94a3b8`,borderRadius:3}}),(0,n.jsxs)(`span`,{style:{fontSize:12,color:`#9ca3af`},children:[t,`px`]})]},e))}),a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  fontFamily: 'sans-serif'
}}>
    {spacingScale.map(({
    label,
    value
  }) => <div key={label} style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12
  }}>
        <span style={{
      width: 80,
      fontSize: 12,
      color: '#6b7280'
    }}>
          {label}
        </span>
        <div style={{
      height: 24,
      width: value,
      background: '#94a3b8',
      borderRadius: 3
    }} />
        <span style={{
      fontSize: 12,
      color: '#9ca3af'
    }}>{value}px</span>
      </div>)}
  </div>`,...a.parameters?.docs?.source}}},o=[`Scale`]}))();export{a as Scale,o as __namedExportsOrder,r as default};