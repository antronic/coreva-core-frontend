### Project Structure
```
coreva-dental/
├─ package.json
├─ tsconfig.json
├─ tsconfig.paths.json
├─ vite.config.ts
├─ .env.example
├─ public/
│  └─ favicon.svg
└─ src/
   ├─ app/
   │  ├─ store.ts
   │  ├─ rootSaga.ts                  # wires all domains + cross-cutting sagas
   │  ├─ hooks.ts                     # typed useAppDispatch/useAppSelector
   │  └─ listeners.ts                 # optional RTK listener middleware
   ├─ routes/
   │  ├─ index.tsx                    # route tree (imports loaders/actions)
   │  ├─ errors/RootError.tsx
   │  └─ guards/requireAuth.loader.ts # gate private routes (throw redirect)
   ├─ pages/                          # route-owned UI (co-locate loader/action if small)
   │  ├─ Landing/
   │  │  └─ index.tsx
   │  ├─ Login/
   │  │  ├─ index.tsx
   │  │  └─ action.ts                 # loginAction
   │  ├─ Dashboard/
   │  │  └─ index.tsx
   │  └─ Patients/
   │     ├─ index.tsx
   │     ├─ loader.ts                 # patientsLoader (defer)
   │     └─ action.ts                 # createPatientAction
   ├─ features/                       # domain state + side effects
   │  ├─ auth/
   │  │  ├─ authSlice.ts
   │  │  ├─ api.ts
   │  │  ├─ sagas/
   │  │  │  ├─ watchers.ts            # root for this domain (forks sub watchers)
   │  │  │  ├─ login.worker.ts
   │  │  │  ├─ logout.worker.ts
   │  │  │  └─ session.worker.ts      # refresh token, bootstrap from storage
   │  │  └─ types.ts
   │  ├─ patients/
   │  │  ├─ patientsSlice.ts          # entity adapter, selectors
   │  │  ├─ api.ts
   │  │  ├─ sagas/
   │  │  │  ├─ watchers.ts
   │  │  │  ├─ list.worker.ts         # GET list (keyed latest)
   │  │  │  ├─ create.worker.ts       # POST create (leading)
   │  │  │  └─ search.worker.ts       # debounced search
   │  │  └─ types.ts
   │  ├─ queue/                       # queue & appointment domains (sample)
   │  │  ├─ queueSlice.ts
   │  │  ├─ api.ts
   │  │  └─ sagas/
   │  │     ├─ watchers.ts
   │  │     └─ realtime.worker.ts     # eventChannel/WebSocket
   │  ├─ ui/
   │  │  └─ uiSlice.ts                # toasts, modals, drawers
   │  └─ doctor/
   |    ├─ core/                         # Shared domain (source of truth)
   |    │  ├─ types.ts                   # Patient, Tooth, ChartingItem, Procedure, Note...
   |    │  ├─ api.ts                     # DoctorAPI.{loadContext, saveNotes, startProcedure, ...}
   |    │  ├─ doctorSlice.ts             # Core normalized entities (patients, visits, teeth)
   |    │  ├─ selectors.ts               # getActiveVisit, getToothById, etc.
   |    │  └─ sagas/
   |    │     ├─ watchers.ts             # core orchestration (e.g., visit bootstrap)
   |    │     └─ bootstrap.worker.ts     # hydrate caches on route entry
   |    ├─ inchair/                      # Subfeature: chairside workflow
   |    │  ├─ pages/
   |    │  │  ├─ index.tsx               # UI shell (layout, toolbars)
   |    │  │  ├─ loader.ts               # loads live visit state, device prefs, timers
   |    │  │  └─ action.ts               # quick mutations (mark-tooth, add-finding)
   |    │  ├─ inchairSlice.ts            # UI state: focused tooth, active tool, timers
   |    │  ├─ components/
   |    │  │  ├─ ToothChart.tsx
   |    │  │  ├─ FindingsPanel.tsx
   |    │  │  ├─ ProcedurePalette.tsx
   |    │  │  └─ ChairsideToolbar.tsx
   |    │  └─ sagas/
   |    │     ├─ watchers.ts
   |    │     ├─ autosave.worker.ts      # debounce autosave to server
   |    │     ├─ realtime.worker.ts      # eventChannel for room/assistant/shared screen
   |    │     └─ devices.worker.ts       # intra-clinic device input (camera, scanner)
   |    └─ aftervisit/                   # Subfeature: post-visit admin+clinical wrap-up
   |        ├─ pages/
   |        │  ├─ index.tsx               # summary + billing + prescriptions
   |        │  ├─ loader.ts               # loads finalized visit, billing items
   |        │  └─ action.ts               # finalize, add prescription, submit claim
   |        ├─ aftervisitSlice.ts         # UI state: draft invoice, claim status, sign-offs
   |        ├─ components/
   |        │  ├─ BillingTable.tsx
   |        │  ├─ PrescriptionForm.tsx
   |        │  ├─ ProgressNotes.tsx
   |        │  └─ SignOffBanner.tsx
   |        └─ sagas/
   |          ├─ watchers.ts
   |          ├─ billing.worker.ts       # rules, discounts, coding (ICD/CPT/UDAs if relevant)
   |          ├─ claims.worker.ts        # payer integration, retries/backoff
   |          └─ documents.worker.ts     # print/export, attachments, secure share
   ├─ ui/                             # design system primitives (stable API)
   │  ├─ atoms/                       # buttons, inputs, labels, icons
   │  ├─ molecules/                   # form rows, toolbar, breadcrumb
   │  └─ organisms/                   # DataTable, Form, Dialog, Drawer
   ├─ components/                     # feature-lean but page-usable widgets
   │  ├─ layout/
   │  │  ├─ AppShell.tsx
   │  │  ├─ Sidebar.tsx
   │  │  └─ Topbar.tsx
   │  ├─ common/
   │  │  ├─ Spinner.tsx
   │  │  ├─ ErrorState.tsx
   │  │  ├─ EmptyState.tsx
   │  │  └─ Pagination.tsx
   │  ├─ patients/
   │  │  ├─ PatientTable.tsx
   │  │  └─ PatientForm.tsx
   │  └─ queue/
   │     ├─ QueueBoard.tsx
   │     └─ QueueCard.tsx
   ├─ services/
   │  ├─ http.ts                      # axios instance (auth header, interceptors)
   │  ├─ socket.ts                    # websocket factory (for eventChannel)
   │  └─ schema.ts                    # zod schemas shared by forms/loaders
   ├─ utils/
   │  ├─ helpers/
   │  │  ├─ createRequestSlice.ts
   │  │  ├─ createEntityHelpers.ts
   │  │  ├─ router.ts                 # revalidate(), simple go()
   │  │  ├─ form.ts                   # toObject(), zod safeParse
   │  │  ├─ debounce.ts
   │  │  ├─ backoff.ts                # retry/backoff util (expo jitter)
   │  │  └─ saga.ts                   # takeLatestByKey, cancellable, guard
   │  └─ constants.ts
   ├─ styles/
   │  └─ index.css
   ├─ main.tsx
   └─ App.tsx
```