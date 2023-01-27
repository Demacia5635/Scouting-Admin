type Season = {
    Seasonnumber:string
    Seasonname:string
}
function movetoseasoneditor(){
    console.log("looged")
}


const SeasonButoon = ({Seasonnumber,Seasonname}: Season) => {
  return (
    <div style={{display: 'flex'}} key={Seasonnumber} onClick={movetoseasoneditor}>
        <p style={{ flex:1, position: 'absolute', left: '0' }}>{Seasonnumber}</p>
        <p style={{flex:1, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>——</p>
        <p style={{flex:1, position: 'absolute', right: '0' }}>{Seasonname}</p>
    </div>
  )
}

export default SeasonButoon