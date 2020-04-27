import React from "react"

import {MdSettings} from "react-icons/md"
import {Link} from "react-router-dom"

export const Header = ({title}) => {


    return (
      <header className="header__container">

          <div className="header__title">

{title}
          </div>
          <div className="header__quick-options">
<Link to="/preferences">

<MdSettings />
</Link>

          </div>
      </header>
    )
}