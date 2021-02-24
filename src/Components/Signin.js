


 export const Signin=(props)=>{
    return( 
      <form onSubmit={props.func}>
          <h1>Hello User</h1>
          <p>Enter your name:</p>
          <input
            type="text"
          />
          <br/>
          <input type="submit" value="Submit" />
      </form>
    )
}