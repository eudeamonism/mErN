import React, { useState, useContext  } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import './PlaceItem.css';
import MapChart from '../../shared/components/UIElements/Map';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

//Here we are receiving props. We only use props.<name> and not what we map, which was the param place.
const PlaceItem = (props) => {
	const navigate = useNavigate();
	const { sendRequest, isLoading, error, clearError } = useHttpClient();
	const auth = useContext(AuthContext);
	const [showMap, setShowMap] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const openMapHandler = () => setShowMap(true);
	const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => {
		setShowConfirmModal(true);
	};
	const cancelDeleteWarningHandler = () => {
		setShowConfirmModal(false);
	};

	const confirmDeleteHandler = async () => {
		setShowConfirmModal(false);
		try {
			await sendRequest(
				`${process.env.REACT_APP_BACK_PORT}places/${props.id}`,
				'DELETE',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			);

			props.onDelete(props.id);
		} catch (err) {}
		navigate(`/`);
	};

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<Modal
				show={showMap}
				onCancel={closeMapHandler}
				header={props.address}
				contentClass="place-item__modal-content"
				footerClass="place-item__modal-actions"
				footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
			>
				<div className="map-container">
					<MapChart center={props.coordinates} zoom={16} />
				</div>
			</Modal>
			<Modal
				show={showConfirmModal}
				onCancel={cancelDeleteWarningHandler}
				header="Are you sure?"
				footerClass="place-item__modal-actions"
				footer={
					<>
						<Button inverse onClick={cancelDeleteWarningHandler}>
							CANCEL
						</Button>
						<Button danger onClick={confirmDeleteHandler}>
							DELETE
						</Button>
					</>
				}
			>
				<p>
					Do you want to proceed and this delete this place? Please note that it
					can not be undone thereafter.
				</p>
			</Modal>
			<li className="place-item">
				<Card className="place-item__content">
					{isLoading && <LoadingSpinner asOverlay />}
					<div className="place-item__image">
						<img
							src={`${process.env.REACT_APP_IMG_URL}${props.image}`}
							alt={props.title}
						/>
					</div>
					<div className="place-item__info">
						<h2>{props.title}</h2>
						<h3>{props.address}</h3>
						<p>{props.description}</p>
					</div>
					<div>
						<div className="place-item__actions">
							<Button inverse onClick={openMapHandler}>
								VIEW ON MAP
							</Button>
							{auth.userId === props.creatorId && (
								<Button to={`/places/${props.id}`}>EDIT</Button>
							)}
							{auth.userId === props.creatorId && (
								<Button danger onClick={showDeleteWarningHandler}>
									DELETE
								</Button>
							)}
						</div>
					</div>
				</Card>
			</li>
		</>
	);
};

export default PlaceItem;

