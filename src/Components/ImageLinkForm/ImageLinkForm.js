import React from 'react';
import './ImageLink.css';

const ImageLinkForm = ({onInputChange, onSubmit } ) => {
	return (
		<div className="">
			<p>{'This magic form will detect face automatically, get a try...'}</p>
				<div className="form pa4 br3 shadow-5 center">
					<input type="text"  className="f5 p2 w-60" onChange = {onInputChange}/>
					<button onClick = {onSubmit} className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple">Dedect</button>
				</div>
		</div>
		)
}

export default ImageLinkForm;