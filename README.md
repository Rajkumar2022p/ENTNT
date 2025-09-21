# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



###  1 . Flow of the Project


/jobs ->	Jobs board with list, filtering, pagination, create/edit modal, archive/unarchive, drag-and-drop reorder.

/jobs/:jobId ->	Job detail page with assessment overview and candidates related to that job.

/candidates	-> Candidate list (virtualized for 1000+ candidates), search & filter by stage.

/candidates/:candidateId ->	Candidate profile with timeline, notes with @mentions, stage movement via Kanban board.

/assessments/:jobId ->	Assessment builder for a job, live preview, and local persistence.

/assessments/:jobId/form ->	Candidate-facing assessment form with validation and conditional logic.

###2 The Whole project directory

src/
│
├─ api/                # MSW or Mirage API mocks
│   └─ index.js
│
├─ db/                 # IndexedDB helpers
│   └─ dexie.js
│
├─ components/
│   ├─ Jobs/
│   │   ├─ JobsBoard.js
│   │   ├─ JobCard.js
│   │   └─ JobFormModal.js
│   ├─ Candidates/
│   │   ├─ CandidateList.js
│   │   ├─ CandidateCard.js
│   │   ├─ CandidateProfile.js
│   │   └─ KanbanBoard.js
│   ├─ Assessments/
│   │   ├─ AssessmentBuilder.js
│   │   ├─ QuestionEditor.js
│   │   └─ LivePreview.js
│   └─ common/          # <--- Reusable components
│       ├─ Button.js
│       ├─ Input.js
│       ├─ Modal.js
│       ├─ Dropdown.js
│       └─ Loader.js
│
├─ hooks/              # Custom hooks
│   ├─ useDebounce.js
│   ├─ useJobs.js
│   └─ useCandidates.js
│
├─ routes/             # Route-level components
│   ├─ JobsRoutes.js
│   ├─ CandidatesRoutes.js
│   └─ AssessmentsRoutes.js
│
├─ utils/              # Helpers
│   ├─ fakerUtils.js
│   └─ dragDropUtils.js
│
├─ store/              # Zustand or Redux store
│   └─ index.js
│
├─ App.js
└─ index.js


### 2. JobsBpard Functionality
JobsBoard.js
├── maintains: jobs (state)
├── calls: createJob(newJob)
├── calls: deleteJob(id)
├── renders: <JobCard job={...} onDelete={deleteJob} />
└── includes: <JobFormModal onAddJob={createJob} />

### 3.

