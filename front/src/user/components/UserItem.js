import React from 'react';
import Avatar from '../../shared/components/UIElements/Avatar';
import { Link } from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import classes from './UserItem.module.css';

//Through props alone, we receive embedded properties within UserItem element, such are key, id, image, name, placeCount properties.
function UserItem(props) {
	return (
		<li className={classes['user-item']}>
			<Card className={classes['user-item__content']}>
				<Link to={`/${props.id}/places`}>
					<div className={classes['user-item__image']}>
						<Avatar image={`${process.env.REACT_APP_IMG_URL}${props.image}`} alt={props.name} />
					</div>
					<div className={classes['user-item__info']}>
						<h2>{props.name}</h2>
						<h3>
							{props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
						</h3>
					</div>
				</Link>
			</Card>
		</li>
	);
}

export default UserItem;
