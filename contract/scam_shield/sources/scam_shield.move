module scam_shield::report_registry {
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use std::string::{Self, String};

    // Constants
    const VERIFICATION_PERIOD: u64 = 259200000; // 3 days in milliseconds
    const MIN_STAKE_AMOUNT: u64 = 1_000_000_000; // 1 SUI in MIST (1 SUI = 10^9 MIST)

    // Error codes
    const EInsufficientStake: u64 = 0;
    const EVerificationPeriodNotEnded: u64 = 2;
    const EAlreadyVerified: u64 = 3;
    const EReportAlreadyResolved: u64 = 4;

    // Report status enum
    public struct ReportStatus has store, copy, drop {
        value: u8
    }

    // Report status constants
    public fun status_pending(): ReportStatus {
        ReportStatus {value: 0}
    }

    public fun status_verified(): ReportStatus {
        ReportStatus {value: 1}
    }

    public fun status_rejected(): ReportStatus {
        ReportStatus {value: 2}
    }

    // Verification public struct
    public struct Verification has store {
        verifier: address,
        verified: bool,
        comment: String,
        timestamp: u64,
    }

    // Main Report object
    public struct Report has key, store {
        id: UID,
        scammer_address: address,
        reporter_address: address,
        scam_type: String,
        description: String,
        contact_info: Option<String>,
        additional_details: Option<String>,
        status: ReportStatus,
        stake: Coin<SUI>,
        created_at: u64,
        verification_deadline: u64,
        verifications: vector<Verification>,
        verification_count: u64,
        rejection_count: u64,
    }

    // Events
    public struct ReportCreated has copy, drop {
        report_id: address,
        scammer_address: address,
        reporter_address: address,
        scam_type: String,
        stake_amount: u64,
        created_at: u64,
        verification_deadline: u64,
    }

    public struct ReportVerified has copy, drop {
        report_id: address,
        verifier: address,
        verified: bool,
        timestamp: u64,
    }

    public struct ReportResolved has copy, drop {
        report_id: address,
        status: ReportStatus,
        verification_count: u64,
        rejection_count: u64,
    }

    // Registry to keep track of all reports
    public struct ReportRegistry has key {
        id: UID,
        reports_count: u64,
        admin: address,
    }

    // Create a new registry (called once during deployment)
    fun init(ctx: &mut TxContext) {
        let registry = ReportRegistry {
            id: object::new(ctx),
            reports_count: 0,
            admin: tx_context::sender(ctx),
        };
        transfer::share_object(registry);
    }

    // Submit a new scam report
    public entry fun submit_report(
        registry: &mut ReportRegistry,
        clock: &Clock,
        scammer_address: address,
        scam_type: vector<u8>,
        description: vector<u8>,
        contact_info: vector<u8>,
        additional_details: vector<u8>,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let stake_amount = coin::value(&payment);
        assert!(
            stake_amount >= MIN_STAKE_AMOUNT,
            EInsufficientStake
        );


        let current_time = clock::timestamp_ms(clock);


        let report = Report {
            id: object::new(ctx),
            scammer_address,
            reporter_address: tx_context::sender(ctx),
            scam_type: string::utf8(scam_type),
            description: string::utf8(description),
            contact_info: if (vector::length(&contact_info) > 0) {
                option::some(string::utf8(contact_info))
            } else {option::none()},
            additional_details: if (vector::length(&additional_details) > 0) {
                option::some(string::utf8(additional_details))
            } else {option::none()},
            status: status_pending(),
            stake: payment,
            created_at: current_time,
            verification_deadline: current_time + VERIFICATION_PERIOD,
            verifications: vector::empty(),
            verification_count: 0,
            rejection_count: 0,
        };

        let report_id = object::uid_to_address(&report.id);

        // Emit event
        event::emit(
            ReportCreated {
                report_id,
                scammer_address,
                reporter_address: tx_context::sender(ctx),
                scam_type: string::utf8(scam_type),
                stake_amount,
                created_at: current_time,
                verification_deadline: current_time + VERIFICATION_PERIOD,
            }
        );

        registry.reports_count = registry.reports_count + 1;

        // Share the report object
        transfer::share_object(report);
    }

    // Verify or reject a report
    public entry fun verify_report(
        report: &mut Report,
        clock: &Clock,
        is_verified: bool,
        comment: vector<u8>,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        assert!(
            current_time <= report.verification_deadline,
            EVerificationPeriodNotEnded
        );
        assert!(
            report.status.value == status_pending().value,
            EReportAlreadyResolved
        );

        let sender = tx_context::sender(ctx);

        // Check if user already verified
        let mut i = 0;
        let length = vector::length(&report.verifications);
        while (i < length) {
            let verification = vector::borrow(&report.verifications, i);
            assert!(
                verification.verifier != sender,
                EAlreadyVerified
            );
            i = i + 1;
        };

        // Add verification
        let verification = Verification {
            verifier: sender,
            verified: is_verified,
            comment: string::utf8(comment),
            timestamp: current_time,
        };

        vector::push_back(
            &mut report.verifications,
            verification
        );

        if (is_verified) {
            report.verification_count = report.verification_count + 1;
        } else {
            report.rejection_count = report.rejection_count + 1;
        };

        // Emit event
        event::emit(
            ReportVerified {
                report_id: object::uid_to_address(&report.id),
                verifier: sender,
                verified: is_verified,
                timestamp: current_time,
            }
        );
    }

    // Resolve report after verification period
    public entry fun resolve_report(
        report: &mut Report,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        assert!(
            current_time > report.verification_deadline,
            EVerificationPeriodNotEnded
        );
        assert!(
            report.status.value == status_pending().value,
            EReportAlreadyResolved
        );

        // Determine status based on verification vs rejection count
        if (report.verification_count > report.rejection_count) {
            report.status = status_verified();
            // In our V2 implementation, we would reward the reporter here
            // and penalize the scammer address
        } else {
            report.status = status_rejected();
            // Return stake to reporter
        };

        // Emit event
        event::emit(
            ReportResolved {
                report_id: object::uid_to_address(&report.id),
                status: report.status,
                verification_count: report.verification_count,
                rejection_count: report.rejection_count,
            }
        );
    }

    // Get report details
    public fun get_report_details(report: &Report)
        : (
        address, // scammer_address
        address, // reporter_address
        String, // scam_type
        String, // description
        ReportStatus, // status
        u64, // stake_amount
        u64, // created_at
        u64, // verification_deadline
        u64, // verification_count
        u64 // rejection_count
    ) {
        (
            report.scammer_address,
            report.reporter_address,
            report.scam_type,
            report.description,
            report.status,
            coin::value(&report.stake),
            report.created_at,
            report.verification_deadline,
            report.verification_count,
            report.rejection_count
        )
    }

    // Get report verifications
    public fun get_verification_count(report: &Report): (u64, u64) {
        (
            report.verification_count,
            report.rejection_count
        )
    }

    // Check if verification period has ended
    public fun is_verification_period_ended(report: &Report, clock: &Clock): bool {
        clock::timestamp_ms(clock) > report.verification_deadline
    }
}
