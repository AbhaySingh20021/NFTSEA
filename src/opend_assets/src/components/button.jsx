
import React, { useEffect, useState } from "react";

function Button(props) {
 return (   <div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
            <span
            id = {props.id}
              onClick={props.handleClick}
              className="form-Chip-label"
            >
              {props.text}
            </span>
            </div>
 )
}

export default Button;