import { Router } from 'express';
import { ReviewController } from '../controllers';
import { RouterInterface, provideRouter } from './registerableRouter';
import { RequestAuthentication } from '../util/auth';

@provideRouter()
export class ReviewRouter implements RouterInterface {
	private readonly _reviewController: ReviewController;
	private readonly _requestAuth: RequestAuthentication;

	public constructor(
		reviewController: ReviewController,
		requestAuth: RequestAuthentication
	) {
		this._reviewController = reviewController;
		this._requestAuth = requestAuth;
	}

	public getPathRoot = (): string => '/review';

	public register = (): Router => {
		const router: Router = Router();

		router.use(this._requestAuth.checkLoggedIn);

		router.get('/', this._requestAuth.checkIsVolunteer, this._reviewController.reviewPage);

		router.get('/next', this._requestAuth.checkIsVolunteer, this._reviewController.nextReview);

		router.post(
			'/submit',
			this._requestAuth.checkLoggedIn,
			this._requestAuth.checkIsVolunteer,
			this._reviewController.submit
		);

		return router;
	};
}
