import { provide } from 'inversify-binding-decorators';
import { PartialApplicant } from '../../models/db/applicant';
import { PartialApplicantRepository } from '../../repositories';
import { ObjectID, Repository, DeleteResult } from 'typeorm';

type ApplicationID = string | number | Date | ObjectID;

export interface PartialApplicantServiceInterface {
	find: (id: ApplicationID, findBy?: keyof PartialApplicant) => Promise<PartialApplicant>;
	save: (id: string, newApplicants: Record<string, string>, file?: Buffer) => Promise<PartialApplicant | undefined>;
	remove: (id: string) => Promise<DeleteResult>;
}

@provide(PartialApplicantService)
export class PartialApplicantService implements PartialApplicantServiceInterface {
	private readonly _partialApplicantRepository: Repository<PartialApplicant>;

	public constructor(
		partialApplicantRepository: PartialApplicantRepository
	) {
		this._partialApplicantRepository = partialApplicantRepository.getRepository();
	}

	public find = async (id: ApplicationID): Promise<PartialApplicant> => {
		try {
			const partialApplicant = await this._partialApplicantRepository.findOne(id);
			if (!partialApplicant) throw new Error('Applicant does not exist');
			return partialApplicant;
		} catch (err) {
			throw new Error(`Failed to find an applicant:\n${(err as Error).message}`);
		}
	};

	public remove = async (id: string): Promise<DeleteResult> => {
		try {
			return await this._partialApplicantRepository.delete(id);
		} catch (err) {
			throw new Error(`Failed to remove partial application. ${(err as Error).message}`);
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public save = async (id: string, rawApplication: Record<string, string>, _file?: Buffer): Promise<PartialApplicant | undefined> => {
		const application = new PartialApplicant();
		application.authId = id;
		application.partialApplication = { ...rawApplication };

		try {
			return await this._partialApplicantRepository.save(application);
		} catch (err) {
			throw new Error('Failed to save/update application');
		}
	};
}
