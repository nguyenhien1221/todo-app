import "./App.css";
import { useState, useRef } from "react";

function App() {
    const inputRef = useRef();

    // get jobs from session storage
    const storedJobs = JSON.parse(sessionStorage.getItem("jobs"));

    const [job, setJob] = useState("");
    const [jobs, setJobs] = useState(storedJobs ?? []);
    const [error, setError] = useState({});
    const [show, setShow] = useState(false);
    const [modifiJob, setModifiJob] = useState("");
    const [updatedJob, setUpdatedJob] = useState("");

    const JOBS_LENGTH = jobs.length;

    const handleSubmit = () => {
        if (job === "") {
            setError({ addError: "*Mời bạn nhập công việc" });
        } else {
            // save job to session storage
            setJobs((prev) => {
                const newJobs = [...prev, job];
                const jsonJobs = JSON.stringify(newJobs);
                sessionStorage.setItem("jobs", jsonJobs);
                return newJobs;
            });
            setError({ addError: "" });
        }
        // focus to input field
        inputRef.current.focus();
        setJob("");
    };

    const handleDelete = (jobIndex) => {
        const newJobsList = jobs.filter((item, index) => index !== jobIndex);
        setJobs(() => {
            const jsonJobs = JSON.stringify(newJobsList);
            sessionStorage.setItem("jobs", jsonJobs);
            return newJobsList;
        });
    };

    const handleUpdate = () => {
        if (updatedJob === "") {
            setShow(!show);
        } else {
            // get index of modifying job and replace by new job
            const modifingJobIndex = jobs.findIndex((x) => x === modifiJob);
            jobs.splice(modifingJobIndex, 1, updatedJob);

            setShow(!show);
            setJobs(() => {
                const jsonJobs = JSON.stringify(jobs);
                sessionStorage.setItem("jobs", jsonJobs);
                return jobs;
            });
            setUpdatedJob("");
            setError({ updateError: "" });
        }
    };

    const toggleShow = (jobIndex) => {
        setShow(!show);
        setModifiJob(jobs[jobIndex]);
    };

    return (
        <>
            <div className={show ? "modify-form" : "deactive"}>
                <i
                    className=" close-btn bx bx-x"
                    onClick={() => setShow(!show)}
                ></i>
                <p className="form-label">Sửa công việc</p>
                <b className="modifying-job">{modifiJob}</b>
                <input
                    className="modifi-input"
                    type="text"
                    onChange={(e) => setUpdatedJob(e.target.value)}
                    value={updatedJob}
                ></input>
                <p className="error">{error.updateError}</p>
                <button onClick={() => handleUpdate()}>Xác nhận</button>
            </div>

            <div className={show ? "container blur" : "container"}>
                <div className="input-form">
                    <p className="form-label">Nhập công việc</p>
                    <input
                        onChange={(e) => setJob(e.target.value)}
                        type="text"
                        placeholder="Nhập công việc cần làm..."
                        value={job}
                        ref={inputRef}
                    ></input>
                    <p className="error">{error.addError}</p>
                    <button onClick={(e) => handleSubmit(e)}>Thêm</button>
                </div>

                <div className="list-job">
                    <ul>
                        {(JOBS_LENGTH > 0 &&
                            jobs.map((item, index) => (
                                <li key={index}>
                                    <div className="item">
                                        <p>
                                            <i className="arrow bx bxs-right-arrow"></i>
                                            {item}
                                        </p>
                                        <div className="item-control">
                                            <i
                                                className="edit-btn bx bxs-edit"
                                                onClick={() =>
                                                    toggleShow(index)
                                                }
                                            ></i>
                                            <i
                                                className="delete-btn bx bxs-trash-alt"
                                                onClick={() =>
                                                    handleDelete(index)
                                                }
                                            ></i>
                                        </div>
                                    </div>
                                </li>
                            ))) || (
                            <p className="no-job">
                                Hiện tại không có công việc nào !
                            </p>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default App;
