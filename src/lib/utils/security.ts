/**
 * Security utilities for client-side password hashing
 * using Web Crypto API (PBKDF2)
 */

export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Generate a random salt
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // Import the password as key material
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        data,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );

    // Derive the key
    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    // Export the key to raw format (or we could just use the derived bits)
    // For simplicity, we'll export the key as raw bytes and hex string it
    const exportedKey = await crypto.subtle.exportKey('raw', key);

    // Convert to hex
    const hashHex = Array.from(new Uint8Array(exportedKey))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    // Convert salt to hex
    const saltHex = Array.from(salt)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [saltHex, originalHash] = storedHash.split(':');

    if (!saltHex || !originalHash) return false;

    // Convert salt hex back to Uint8Array
    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        data,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    const exportedKey = await crypto.subtle.exportKey('raw', key);
    const hashHex = Array.from(new Uint8Array(exportedKey))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return hashHex === originalHash;
}
