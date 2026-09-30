import Toggle from "../theme/toggle"
import Display from "./display"
import Filter from "./filter"
import Search from "./search"


function Header(){
  return(
    <div>
      <header className="p-3 sm:flex justify-between items-center border-b border-theme space-y-2 sm:space-y-0">
        <Search />
        <div className="flex sm:justify-end space-x-4 items-center">
          <Filter />
          <Display />
          <Toggle />
        </div> 
      </header>
    </div>
  )
}

export default Header